import axios from "axios";

import experimentsJson from "../jsons/experiments.json";

async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, ms);
  });
}

const parseInteraction = (interaction) => {
  return {
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
