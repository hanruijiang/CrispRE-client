<template>
  <el-dialog
    v-if="detailed != null"
    v-model="display"
    fullscreen
    :show-close="false"
  >
    <template #title>
      <el-button
        style="float: right; font-size: 18px"
        icon="el-icon-close"
        type="text"
        @click="close"
      >
      </el-button>
    </template>

    <h1 style="text-align: left; width: 89%; padding-left: 10%">
      <span class="ex-title">gene</span><br />
      {{ detailed.gene.symbol }}
    </h1>

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
        :href="'https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=' + gene"
        target="_blank"
        :underline="false"
      >
        <h3 class="ex-info">
          <span class="ex-title">Ensembl gene ID</span><br />{{ gene }}
        </h3></el-link
      >

      <h3 class="ex-info" style="width: 304px">
        <span class="ex-title">region</span><br />
        {{
          detailed.gene.chromosome +
          ":" +
          detailed.gene.start +
          "-" +
          detailed.gene.end
        }}
      </h3>

      <h3 class="ex-info">
        <span class="ex-title">strand</span><br />
        {{ detailed.gene.strand }}
      </h3>
    </el-space>

    <h1 style="text-align: left; width: 89%; padding-left: 10%">
      <span class="ex-title">target</span><br />
      {{
        detailed.target.chromosome +
        ":" +
        detailed.target.start +
        "-" +
        detailed.target.end
      }}
    </h1>

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
      <h3 class="ex-info" style="width: 304px">
        <span class="ex-title">sequence</span><br />
        <template v-for="(item, index) in detailed.target.gRNAs" :key="index">
          {{ item.sequence }}
          <br />
        </template>
      </h3>

      <h3 class="ex-info">
        <span class="ex-title">position</span><br />
        <template v-for="(item, index) in detailed.target.gRNAs" :key="index">
          {{ item.chromosome + ":" + item.position }}
          <br />
        </template>
      </h3>

      <h3
        class="ex-info"
        v-if="experimentsJson[experiment].ORGANISM == 'Homo sapiens'"
      >
        <span class="ex-title">related SNPs</span><br />
        <el-link
          :href="
            'https://www.ncbi.nlm.nih.gov/snp/?term=' +
            detailed.target.chromosome.slice(3) +
            '%5BChromosome%5D+AND+' +
            detailed.target.start +
            '%3A' +
            detailed.target.end +
            '%5BBase+Position%5D'
          "
          target="_blank"
          :underline="false"
          ><i class="el-icon-search"></i
        ></el-link>
      </h3>

      <h3
        class="ex-info"
        v-if="
          experimentsJson[experiment].ORGANISM == 'Homo sapiens' ||
          experimentsJson[experiment].ORGANISM == 'Mus musculus'
        "
      >
        <span class="ex-title">related ccREs</span><br />
        <el-link
          :href="
            'https://screen.encodeproject.org/search/?q=' +
            detailed.target.chromosome +
            '%3A' +
            detailed.target.start +
            '-' +
            detailed.target.end +
            '&assembly=' +
            (experimentsJson[experiment].ORGANISM == 'Homo sapiens'
              ? 'GRCh38'
              : 'mm10')
          "
          target="_blank"
          :underline="false"
          ><i class="el-icon-search"></i
        ></el-link>
      </h3>
    </el-space>

    <h1
      style="text-align: left; width: 89%; padding-left: 10%; margin-bottom: 0"
    >
      <span class="ex-title">regulatory interaction</span><br />
    </h1>

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
      <h1 class="ex-info">
        <span class="ex-title">distance</span><br />
        <b>{{ detailed.distance }}</b>
      </h1>

      <h1
        class="ex-info"
        v-for="item in titles.interaction"
        :key="item.value"
        v-show="experimentsJson[experiment][item.value]"
      >
        <span class="ex-title"
          >{{ item.label }}
          <el-tooltip
            class="item"
            effect="dark"
            :content="experimentsJson[experiment][item.value]"
            placement="top-start"
          >
            <i class="el-icon-question"></i>
          </el-tooltip> </span
        ><br />
        <b>{{ detailed[item.value.toLowerCase()] }}</b>
      </h1>

      <h1 class="ex-info" v-show="experimentsJson[experiment].SIGNIFICANT">
        <span class="ex-title"
          >significant
          <el-tooltip
            class="item"
            effect="dark"
            :content="experimentsJson[experiment].SIGNIFICANT"
            placement="top-start"
          >
            <i class="el-icon-question"></i>
          </el-tooltip> </span
        ><br />
        <b>{{
          detailed.significant == null ? "" : Boolean(detailed.significant)
        }}</b>
      </h1>
    </el-space>
    <h1 style="text-align: left; width: 89%; padding-left: 10%">
      <span class="ex-title">experiment</span><br />

      <el-link
        :href="'experiments?experiment=' + experiment"
        target="_blank"
        :underline="false"
      >
        <h1 style="margin: 0">{{ experiment }}</h1>
      </el-link>
    </h1>

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
        v-for="item in titles.experiment"
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
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import experimentsJson from "../jsons/experiments.json";

import {
  getExperiment,
  getRelatedExperiments,
  getInteraction,
} from "../plugins/utils";

export default defineComponent({
  components: {},
  data() {
    return {
      display: true,
      experimentsJson: experimentsJson,
      experiment: null,
      gene: null,
      target: null,
      titles: {
        experiment: [
          { label: "organism", value: "ORGANISM" },
          { label: "organ", value: "ORGAN" },
          { label: "biosample", value: "BIOSAMPLE" },
          { label: "perturbation", value: "PERTURBATION" },
          { label: "construct", value: "CONSTRUCT" },
          { label: "transfection", value: "TRANSFECTION" },
          { label: "phenotype", value: "PHENOTYPE" },
        ],
        interaction: [
          { label: "fraction change", value: "FRACTION_CHANGE" },
          { label: "p-value", value: "P_VALUE" },
          { label: "q-value", value: "Q_VALUE" },
        ],
      },
      detailed: null,
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
      let experiment = getExperiment(this.$route.query["experiment"]);
      let gene = this.$route.query["gene"];
      let target = this.$route.query["target"];

      if (experiment == null || gene == null || target == null) {
        experiment = null;
        gene = null;
        target = null;
      }

      return { experiment: experiment, gene: gene, target: target };
    },

    async applyFilters(filters) {
      if (
        filters.experiment == this.experiment &&
        filters.gene == this.gene &&
        filters.target == this.target
      ) {
        return new Promise((r) => {
          r(this.detailed != null);
        });
      }

      if (filters.experiment == null) {
        this.detailed = null;
      } else {
        this.detailed = await getInteraction({
          ...filters,
          organism: experimentsJson[filters.experiment].ORGANISM,
        });
      }

      if (this.detailed == null) {
        this.experiment = null;
        this.gene = null;
        this.target = null;
        return false;
      }

      this.experiment = filters.experiment;
      this.gene = filters.gene;
      this.target = filters.target;

      return true;
    },
  },
  watch: {
    $route(n, o) {
      this.applyFilters(this.loadFilters());
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
  font-weight: normal;
}
</style>
