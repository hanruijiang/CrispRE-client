<template>
  <el-space :wrap="warp" alignment="start">
    <el-card
      v-for="item in experiments"
      :key="item"
      style="width: 290px"
      shadow="hover"
    >
      <template #header>
        <h4 style="text-align: left; margin: 0">
          {{ experimentsJson[item].EXID }}
          <router-link
            :to="'experiments?experiment=' + experimentsJson[item].EXID"
          >
            <i class="el-icon-more" style="float: right; cursor: pointer"></i>
          </router-link>
        </h4>
      </template>
      <el-space wrap style="text-align: left">
        <div style="width: 120px">
          <span style="font-size: 12px; color: #909399">PubMed ID</span><br />
          <el-link
            :href="
              'https://pubmed.ncbi.nlm.nih.gov/' + experimentsJson[item].PMID
            "
            target="_blank"
            :underline="false"
            >{{ experimentsJson[item].PMID }}</el-link
          >
        </div>
        <div style="width: 110px">
          <span style="font-size: 12px; color: #909399">organism</span><br />{{
            experimentsJson[item].ORGANISM
          }}
        </div>
        <div style="width: 120px">
          <span style="font-size: 12px; color: #909399">organ</span><br />{{
            experimentsJson[item].ORGAN
          }}
        </div>
        <div style="width: 110px">
          <span style="font-size: 12px; color: #909399">biosample</span><br />{{
            experimentsJson[item].BIOSAMPLE
          }}
        </div>
        <div style="width: 120px">
          <span style="font-size: 12px; color: #909399">perturbation</span
          ><br />{{ experimentsJson[item].PERTURBATION }}
        </div>
        <div style="width: 110px">
          <span style="font-size: 12px; color: #909399">phenotype</span><br />{{
            experimentsJson[item].PHENOTYPE
          }}
        </div>
      </el-space>
    </el-card>
  </el-space>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import experimentsJson from "../jsons/experiments.json";

export default defineComponent({
  props: {
    experiments: Array,
    warp: Boolean,
  },
  data() {
    return {
      experimentsJson: experimentsJson,
    };
  },
  methods: {},
});
</script>
