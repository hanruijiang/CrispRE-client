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
    },
    target: {
      TID: interaction[6],
      chromosome: interaction[7],
      start: interaction[8],
      end: interaction[9],
    },
    distance: interaction[10],
    fraction_change: interaction[11],
    p_value: interaction[12],
    q_value: interaction[13],
    significant: interaction[14],
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
