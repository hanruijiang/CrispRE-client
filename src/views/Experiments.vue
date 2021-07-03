<template>
  <el-container>
    <el-aside witdh="250px">
      <h2 style="text-align: left; padding-left: 10px">Search</h2>
      <p>&#10;</p>
      <EXFilter ref="exfilter" :allow-multi-organisms="true"></EXFilter>
      <p>&#10;</p>
      <el-button
        type="primary"
        @click="filter"
        style="float: center; width: 280px; margin-left: 10px"
        size="medium"
      >
        apply
      </el-button>
    </el-aside>

    <el-main>
      <el-input
        v-model="search_text"
        clearable
        @clear="search"
        @change="search"
      >
        <template #prepend>
          <el-select v-model="search_type" style="width: 120px">
            <el-option label="author" value="author"></el-option>
            <el-option label="PubMed ID" value="PubMed ID"></el-option>
          </el-select>
        </template>
        <template #append>
          <el-button icon="el-icon-search" @click="search"></el-button>
        </template>
      </el-input>

      <p>&#10;</p>

      <h2 v-show="experiments.length == 0">
        No experiments were found, please try other options
      </h2>

      <EXCards
        v-show="experiments.length > 0"
        :experiments="experiments"
        :warp="true"
      >
      </EXCards>

      <Experiment ref="experiment"></Experiment>
    </el-main>
  </el-container>
</template>

<script>
import EXFilter from "@/components/EXFilter.vue";
import EXCards from "@/components/EXCards.vue";
import Experiment from "@/components/Experiment.vue";
import experimentsJson from "../jsons/experiments.json";

export default {
  components: {
    EXFilter,
    EXCards,
    Experiment,
  },
  data() {
    return {
      // ui
      experimentsJson: experimentsJson,
      search_types: ["auther", "PubMed ID"],
      // value
      search_type: "author",
      search_text: "",
      experiments: Object.keys(experimentsJson).sort(),
      experiment: this.$route.query["EXID"],
    };
  },
  methods: {
    async filter() {
      let experiments = await this.$refs.exfilter.applyFilters();
      this.experiments = experiments.sort();
    },
    search() {
      let query = {};
      if (this.search_text && this.search_text.length > 0) {
        if (this.search_type == "author") {
          query["author"] = this.search_text.trim().toLowerCase();
          this.experiments = Object.entries(experimentsJson)
            .filter(([b, info]) => {
              return b.toLowerCase().startsWith(query["author"]);
            })
            .map(([b, info]) => {
              return b;
            })
            .sort();
        }
        if (this.search_type == "PubMed ID") {
          query["PMID"] = parseInt(this.search_text.trim());
          this.experiments = Object.entries(experimentsJson)
            .filter(([b, info]) => {
              return info.PMID == query["PMID"];
            })
            .map(([b, info]) => {
              return b;
            })
            .sort();
        }
      } else {
        this.experiments = Object.keys(experimentsJson).sort();
      }
      this.$router.replace({
        path: this.$route.path,
        query: query,
      });
    },
  },
  mounted() {
    this.$refs.experiment.applyFilters(this.$refs.experiment.loadFilters());
    if ("PMID" in this.$route.query) {
      this.search_type == "PubMed ID";
      this.search_text = this.$route.query["PMID"];
      this.search();
    } else if ("author" in this.$route.query) {
      this.search_type == "author";
      this.search_text = this.$route.query["author"];
      this.search();
    } else {
      this.$refs.exfilter.loadFilters();
      this.filter();
    }
  },
};
</script>

<style scoped></style>
