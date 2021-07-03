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
            ? 304
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

    <h1>&#10;</h1>

    <div>
      <router-link
        v-if="experimentsJson[experiment].N_SIGNIFICANT > 0"
        :to="'interactions?significant=true&experiment=' + experiment"
        target="_blank"
      >
        <el-button plain type="success" style="margin-right: 25px">
          <h3>
            Browse {{ experimentsJson[experiment].N_SIGNIFICANT }} significant
            interactions
          </h3>
        </el-button>
      </router-link>

      <router-link
        :to="'interactions?experiment=' + experiment"
        target="_blank"
      >
        <el-button plain type="primary" style="margin-left: 25px">
          <h3>
            Browse all {{ experimentsJson[experiment].N_PAIRS }} interactions
          </h3>
        </el-button>
      </router-link>
    </div>

    <div v-if="related_experiments.length > 0">
      <h2
        style="text-align: left; width: 80%; margin-left: 10%; margin-top: 30px"
      >
        Related experiments
      </h2>
      <el-scrollbar
        v-if="related_experiments.length > 0"
        style="width: 80%; margin-left: 10%"
      >
        <EXCards :experiments="related_experiments" :warp="false"> </EXCards>
      </el-scrollbar>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EXCards from "@/components/EXCards.vue";
import experimentsJson from "../jsons/experiments.json";

import { getExperiment, getRelatedExperiments } from "../plugins/utils";

export default defineComponent({
  components: {
    EXCards,
  },
  data() {
    return {
      display: true,
      experimentsJson: experimentsJson,
      experiment: null,
      related_experiments: [],
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
      if (
        window.history.state.position > 0 &&
        window.history.state.back != null
      ) {
        this.$router.back();
      } else {
        this.$router.push({
          path: "/",
        });
      }
    },
    loadFilters() {
      return getExperiment(this.$route.query["experiment"]);
    },
    async applyFilters(experiment) {
      this.experiment = getExperiment(experiment);
      this.related_experiments = getRelatedExperiments(this.experiment);
      return new Promise((r) => {
        r(this.experiment != null);
      });
    },
  },
  watch: {
    $route(n, o) {
      if (n.query["experiment"] != o.query["experiment"]) {
        this.applyFilters(this.loadFilters());
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
