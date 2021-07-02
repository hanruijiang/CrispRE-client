<template>
  <el-table :data="interactions" @rowClick="showDetail">
    <el-table-column type="index" :index="currentIndex"></el-table-column>

    <el-table-column
      label="experiment"
      v-if="columns.includes('experiment')"
      align="center"
      width="180px"
    >
      <template #default="scope">
        <el-link
          :href="'experiments?experiment=' + scope.row.experiment.EXID"
          target="_blank"
          :underline="false"
          >{{ scope.row.experiment.EXID }}</el-link
        >
      </template>
    </el-table-column>

    <el-table-column
      prop="experiment.ORGAN"
      label="organ"
      align="center"
      v-if="columns.includes('organ')"
    ></el-table-column>

    <el-table-column
      prop="experiment.BIOSAMPLE"
      label="biosample"
      align="center"
      v-if="columns.includes('biosample')"
      min-width="100px"
    ></el-table-column>

    <el-table-column
      prop="experiment.PERTURBATION"
      label="perturbation"
      align="center"
      v-if="columns.includes('perturbation')"
      min-width="110px"
    ></el-table-column>

    <el-table-column
      prop="experiment.PHENOTYPE"
      label="phenotype"
      align="center"
      v-if="columns.includes('phenotype')"
      min-width="100px"
    ></el-table-column>

    <el-table-column
      label="gene"
      v-if="columns.includes('gene')"
      align="center"
      min-width="100px"
    >
      <template #default="scope">
        <el-link
          :href="
            'https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=' +
            scope.row.gene.ENSG
          "
          target="_blank"
          :underline="false"
          >{{ scope.row.gene.symbol }}</el-link
        >
      </template>
    </el-table-column>

    <el-table-column
      label="Ensembl gene ID"
      v-if="columns.includes('Ensembl gene ID')"
      align="center"
      min-width="160px"
    >
      <template #default="scope">
        <el-link
          :href="
            'https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=' +
            scope.row.gene.ENSG
          "
          target="_blank"
          :underline="false"
          >{{ scope.row.gene.ENSG }}</el-link
        >
      </template>
    </el-table-column>

    <el-table-column
      label="gene region"
      v-if="columns.includes('gene region')"
      align="center"
      width="240px"
    >
      <template #default="scope">
        {{
          scope.row.gene.chromosome +
          ":" +
          scope.row.gene.start +
          "-" +
          scope.row.gene.end
        }}</template
      >
    </el-table-column>

    <el-table-column
      label="strand"
      v-if="columns.includes('gene strand')"
      align="center"
      width="60px"
    >
      <template #default="scope"> {{ scope.row.gene.strand }}</template>
    </el-table-column>

    <el-table-column
      label="target region"
      v-if="columns.includes('target region')"
      align="center"
      width="240px"
    >
      <template #default="scope">
        {{
          scope.row.target.chromosome +
          ":" +
          scope.row.target.start +
          "-" +
          scope.row.target.end
        }}</template
      >
    </el-table-column>

    <el-table-column
      prop="distance"
      label="distance"
      v-if="columns.includes('distance')"
      align="center"
    ></el-table-column>

    <el-table-column
      prop="fraction_change"
      v-if="columns.includes('fraction change')"
      align="center"
    >
      <template #header>fraction<br />change</template>
    </el-table-column>

    <el-table-column
      prop="p_value"
      label="p-value"
      v-if="columns.includes('p-value')"
      align="center"
    ></el-table-column>

    <el-table-column
      prop="q_value"
      label="q-value"
      v-if="columns.includes('q-value')"
      align="center"
    ></el-table-column>

    <el-table-column
      label="sig."
      v-if="columns.includes('significant')"
      align="center"
      width="60px"
    >
      <template #default="scope">
        <i
          v-if="scope.row.significant == 1"
          class="el-icon-check"
          style="font-weight: bold"
        ></i>
        <i
          v-else-if="scope.row.significant == 0"
          class="el-icon-close"
          style="color=#C0C4CC"
        ></i>
      </template>
    </el-table-column>

    <el-table-column
      v-if="columns.includes('related SNPs') && organism == 'Homo sapiens'"
      align="center"
      width="80px"
    >
      <template #header>related<br />SNPs</template>
      <template #default="scope">
        <el-link
          :href="
            'https://www.ncbi.nlm.nih.gov/snp/?term=' +
            scope.row.target.chromosome.slice(3) +
            '%5BChromosome%5D+AND+' +
            scope.row.target.start +
            '%3A' +
            scope.row.target.end +
            '%5BBase+Position%5D'
          "
          target="_blank"
          :underline="false"
          ><i class="el-icon-search"></i
        ></el-link>
      </template>
    </el-table-column>

    <el-table-column
      v-if="
        columns.includes('related ccREs') &&
        (organism == 'Homo sapiens' || organism == 'Mus musculus')
      "
      align="center"
      width="80px"
    >
      <template #header>related<br />ccREs</template>
      <template #default="scope">
        <el-link
          :href="
            'https://screen.encodeproject.org/search/?q=' +
            scope.row.target.chromosome +
            '%3A' +
            scope.row.target.start +
            '-' +
            scope.row.target.end +
            '&assembly=' +
            (organism == 'Homo sapiens' ? 'GRCh38' : 'mm10')
          "
          target="_blank"
          :underline="false"
          ><i class="el-icon-search"></i
        ></el-link>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import biosamplesJson from "../jsons/biosamples.json";
import experimentsJson from "../jsons/experiments.json";

export default defineComponent({
  props: {
    currentIndex: Number,
    organism: String,
    columns: Array,
    interactions: Array,
  },
  data() {
    return {
      experiments: experimentsJson,
      detailDisplay: false,
    };
  },
  methods: {
    indexMethod(index) {
      return index + this.currentIndex;
    },
    showDetail(row, column, event) {
      this.detailDisplay = true;
    },
  },
});
</script>
