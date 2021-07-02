<template>
  <el-dialog v-if="experiment" v-model="display" fullscreen :show-close="false">
    <template #title>
      <el-affix position="top" :offset="0">
        <h1
          style="
            text-align: left;
            width: 89%;
            padding-left: 10%;
            margin: 0;
            background: #ffffff;
          "
        >
          <el-button
            style="float: right; font-size: 18px"
            icon="el-icon-close"
            type="text"
            @click="close"
          >
          </el-button>
          <span class="ex-title">experiment</span><br />
          {{ experimentsJson[experiment].EXID }}
        </h1>
      </el-affix>
    </template>
    <el-space
      wrap
      style="
        text-align: left;
        width: 90%;
        margin-left: 10%;
        word-break: keep-all;
      "
      alignment="start"
    >
      <el-link
        :href="
          'https://pubmed.ncbi.nlm.nih.gov/' + experimentsJson[experiment].PMID
        "
        target="_blank"
        :underline="false"
      >
        <h3 class="ex-info">
          <span class="ex-title">PubMed ID</span><br />
          {{ experimentsJson[experiment].PMID }}
        </h3>
      </el-link>

      <h3
        class="ex-info"
        v-for="item in titles"
        :key="item.value"
        v-show="experimentsJson[experiment][item.value]"
        :style="
          'width:' +
          (String(experimentsJson[experiment][item.value]).length > 50
            ? 300
            : 200) +
          'px'
        "
      >
        <span class="ex-title">{{ item.label }}</span
        ><br />
        {{ experimentsJson[experiment][item.value] }}
      </h3>
    </el-space>
    <h3
      style="
        text-align: left;
        width: 80%;
        padding-left: 10%;
        word-break: keep-all;
        margin: 10px 0;
        font-weight: normal;
      "
    >
      <span class="ex-title">description</span><br />
      <p
        v-for="(item, index) in experimentsJson[experiment].DESCRIPTION.split(
          '\n'
        )"
        :key="index"
      >
        {{ item }}
      </p>
    </h3>

    <h2
      style="text-align: left; width: 80%; margin-left: 10%; margin-top: 30px"
    >
      {{
        related_experiments.length > 0
          ? "Related experiments"
          : "No related experiments"
      }}
    </h2>
    <el-scrollbar
      v-if="related_experiments.length > 0"
      style="width: 80%; margin-left: 10%"
    >
      <EXCards :experiments="related_experiments" :warp="false"> </EXCards>
    </el-scrollbar>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EXCards from "@/components/EXCards.vue";
import experimentsJson from "../jsons/experiments.json";

const getRelatedExperiments = (experiment) => {
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

const getExperiment = (experiment) => {
  if (experiment) {
    return Object.keys(experimentsJson).includes(experiment)
      ? experiment
      : null;
  }
  return null;
};

export default defineComponent({
  components: {
    EXCards,
  },
  data() {
    let experiment = getExperiment(this.$route.query["experiment"]);
    return {
      display: true,
      experimentsJson: experimentsJson,
      experiment: experiment,
      related_experiments: getRelatedExperiments(experiment),
      titles: [
        { label: "organism", value: "ORGANISM" },
        { label: "organ", value: "ORGAN" },
        { label: "biosample", value: "BIOSAMPLE" },
        { label: "perturbation", value: "PERTURBATION" },
        { label: "construct", value: "CONSTRUCT" },
        { label: "transfection", value: "TRANSFECTION" },
        { label: "phenotype", value: "PHENOTYPE" },
        { label: "fraction change", value: "FRACTION_CHANGE" },
        { label: "p-value", value: "P_VALUE" },
        { label: "q-value", value: "Q_VALUE" },
        { label: "significance", value: "SIGNIFICANT" },
        { label: "original data", value: "AUTHOR_DATA" },
      ],
    };
  },
  methods: {
    close() {
      if (window.history.state.position > 0) {
        this.$router.back();
      } else {
        this.$router.push({
          path: "experiments",
        });
      }
    },
  },
  watch: {
    $route(n, o) {
      if (n.query["experiment"] != o.query["experiment"]) {
        this.experiment = getExperiment(this.$route.query["experiment"]);
        this.related_experiments = getRelatedExperiments(this.experiment);
      }
    },
  },
});
</script>

<style scoped>
.ex-title {
  font-size: 15px;
  color: #909399;
  font-weight: normal;
  padding: 4px 0;
}
.ex-info {
  width: 200px;
  margin: 6px 0;
}
</style>
