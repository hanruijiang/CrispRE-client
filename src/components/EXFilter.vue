<template>
  <h3 style="text-align: left; padding-left: 15px">
    Biosamples
    <el-tooltip
      class="item"
      effect="dark"
      content="organisms, organs or biosamples used in experiments"
      placement="top-start"
    >
      <i class="el-icon-question"></i>
    </el-tooltip>
  </h3>
  <el-cascader
    v-model="biosample"
    :options="biosamples"
    :props="{ checkStrictly: true }"
    :clearable="allowMultiOrganisms"
    @change="onBiosampleChange"
  >
  </el-cascader>

  <h3 style="text-align: left; padding-left: 15px">Strategy</h3>

  <p style="text-align: left; padding-left: 25px">
    perturbation
    <el-tooltip
      class="item"
      effect="dark"
      content="methods for perturbing target elements"
      placement="top-start"
    >
      <i class="el-icon-question"></i>
    </el-tooltip>
  </p>
  <el-select v-model="perturbation" multiple clearable>
    <el-option
      v-for="item in perturbations"
      :key="item"
      :label="item"
      :value="item"
    >
    </el-option>
  </el-select>
  <p style="text-align: left; padding-left: 25px">
    phenotype
    <el-tooltip
      class="item"
      effect="dark"
      content="methods for measuring effects"
      placement="top-start"
    >
      <i class="el-icon-question"></i>
    </el-tooltip>
  </p>
  <el-select v-model="phenotype" multiple clearable>
    <el-option
      v-for="item in phenotypes"
      :key="item"
      :label="item"
      :value="item"
    >
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import biosamplesJson from "../jsons/biosamples.json";
import experimentsJson from "../jsons/experiments.json";

const filterExperiments = (filters) => {
  return Object.entries(experimentsJson)
    .filter(([b, info]) => {
      for (let i in filters) {
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

export default defineComponent({
  props: {
    allowMultiOrganisms: Boolean,
  },
  emits: ["biosampleChange"],
  data() {
    return {
      // ui
      biosamples: Object.entries(biosamplesJson).map((o) => {
        return {
          value: o[0],
          label: o[0],
          children: Object.entries(o[1]).map((og) => {
            return {
              value: og[0],
              label: og[0],
              children: og[1].map((b) => {
                return { value: b, label: b };
              }),
            };
          }),
        };
      }),
      perturbations: Array.from(
        new Set(
          Object.values(experimentsJson).map((info) => {
            return info.PERTURBATION;
          })
        )
      ),
      phenotypes: Array.from(
        new Set(
          Object.values(experimentsJson).map((info) => {
            return info.PHENOTYPE;
          })
        )
      ),

      // value
      biosample: this.allowMultiOrganisms ? [] : ["Homo sapiens"],
      perturbation: [],
      phenotype: [],
    };
  },
  methods: {
    onBiosampleChange() {
      this.$emit(
        "biosampleChange",
        this.biosample && this.biosample.length > 0 ? this.biosample[0] : null
      );
    },

    async applyFilters() {
      let query = Object.fromEntries(Object.entries(this.$route.query));
      let filters = {};

      delete query["organism"];
      delete query["organ"];
      delete query["biosample"];
      if (this.biosample && this.biosample.length > 0) {
        filters["ORGANISM"] = this.biosample[0];
        query["organism"] = this.biosample[0];

        if (this.biosample.length > 1) {
          filters["ORGAN"] = this.biosample[1];
          query["organ"] = this.biosample[1];
        }

        if (this.biosample.length > 2) {
          filters["BIOSAMPLE"] = this.biosample[2];
          query["biosample"] = this.biosample[2];
        }
      }

      delete query["perturbation"];
      if (this.perturbation && this.perturbation.length > 0) {
        filters["PERTURBATION"] = Array.from(this.perturbation);
        query["perturbation"] = this.perturbation.join(",");
      }

      delete query["phenotype"];
      if (this.phenotype && this.phenotype.length > 0) {
        filters["PHENOTYPE"] = Array.from(this.phenotype);
        query["phenotype"] = this.phenotype.join(",");
      }

      await this.$router.replace({
        path: this.$route.path,
        query: query,
      });
      return filterExperiments(filters);
    },
    loadFilters() {
      if ("organism" in this.$route.query) {
        if (this.$route.query["organism"] in biosamplesJson) {
          this.biosample = [this.$route.query["organism"]];
        }
      }

      if ("organ" in this.$route.query) {
        if (
          this.biosample.length == 1 &&
          this.$route.query["organ"] in biosamplesJson[this.biosample[0]]
        ) {
          this.biosample[1] = this.$route.query["organ"];
        }
      }

      if ("biosample" in this.$route.query) {
        if (
          this.biosample.length == 2 &&
          biosamplesJson[this.biosample[0]][this.biosample[1]].includes(
            this.$route.query["biosample"]
          )
        ) {
          this.biosample[2] = this.$route.query["biosample"];
        }
      }

      if ("perturbation" in this.$route.query) {
        this.perturbation = this.$route.query["perturbation"]
          .split(",")
          .filter((i) => {
            return this.perturbations.includes(i);
          });
      }

      if ("phenotype" in this.$route.query) {
        this.phenotype = this.$route.query["phenotype"]
          .split(",")
          .filter((i) => {
            return this.phenotypes.includes(i);
          });
      }
    },
  },
});
</script>
