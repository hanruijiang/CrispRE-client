import axios from "axios";

import experimentsJson from "../jsons/experiments.json";

export const getExperiment = (experiment) => {
  if (experiment) {
    return Object.keys(experimentsJson).includes(experiment)
      ? experiment
      : null;
  }
  return null;
};

export const getRelatedExperiments = (experiment) => {
  if (!experiment) {
    return [];
  }
  return Object.entries(experimentsJson)
    .filter(([b, info]) => {
      return (
        info.PMID == experimentsJson[experiment].PMID &&
        info.EXID != experimentsJson[experiment].EXID
      );
    })
    .map(([b, info]) => {
      return b;
    });
};

export const filterExperiments = (filters) => {
  return Object.entries(experimentsJson)
    .filter(([b, info]) => {
      for (const i in filters) {
        if (filters[i] instanceof Array) {
          if (!filters[i].includes(info[i])) {
            return false;
          }
        } else {
          if (filters[i] != info[i]) {
            return false;
          }
        }
      }
      return true;
    })
    .map(([b, info]) => {
      return b;
    });
};

const parseInteraction = (interaction) => {
  const basic = {
    experiment: experimentsJson[interaction[0]],
    gene: {
      ENSG: interaction[1],
      symbol: interaction[2],
      chromosome: interaction[3],
      start: interaction[4],
      end: interaction[5],
      strand: interaction[6],
    },
    target: {
      TID: interaction[7],
      chromosome: interaction[8],
      start: interaction[9],
      end: interaction[10],
    },
    distance: interaction[11],
    fraction_change: interaction[12],
    p_value: interaction[13],
    q_value: interaction[14],
    significant: interaction[15],
  };

  if (interaction.length >= 19) {
    const gRNA_sequences = interaction[17].split(";");
    const gRNA_positions = interaction[18].split(";").map((p) => {
      if (p.length == 0) {
        return null;
      } else {
        return parseInt(p);
      }
    });
    basic.target["gRNAs"] = Array.from(Array(interaction[16]).keys()).map(
      (i) => {
        return {
          sequence: gRNA_sequences[i],
          chromosome: interaction[8],
          position: gRNA_positions[i],
        };
      }
    );
  }

  return basic;
};

export const getTargetInfo = (target) => {
  return axios({
    method: "POST",
    headers: { "content-type": "application/json" },
    data: { target: target },
    url: "/api/target",
  }).then((res) => {
    return res.data;
  });
};

export const getInteractions = (query) => {
  console.log(query);
  return axios({
    method: "POST",
    headers: { "content-type": "application/json" },
    data: query,
    url: "/api/interactions",
  }).then((res) => {
    console.log(res.data);
    res.data["interactions"] = res.data.interactions.map(parseInteraction);
    return res.data;
  });
};

export const getInteraction = (query) => {
  console.log(query);
  return axios({
    method: "POST",
    headers: { "content-type": "application/json" },
    data: query,
    url: "/api/interaction",
  }).then((res) => {
    console.log(res.data);
    return "interaction" in res.data
      ? parseInteraction(res.data.interaction)
      : null;
  });
};
