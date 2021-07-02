<template>
  <el-form ref="form" :model="form" :rules="rules" label-position="right">
    <h2 style="text-align: left; padding-left: 10px">
      Search
      <el-button
        type="primary"
        @click="onSearchApply"
        style="float: right"
        size="medium"
      >
        apply
      </el-button>
    </h2>
    <el-divider></el-divider>

    <EXFilter
      ref="exfilter"
      :allow-multi-organisms="false"
      @biosample-change="onBiosampleChange"
    ></EXFilter>

    <h3 style="text-align: left; padding-left: 15px">Gene filter</h3>
    <el-select v-model="gene_filter" clearable>
      <el-option label="genomic region" value="genomic region"></el-option>
      <el-option label="Ensembl gene ID" value="Ensembl gene ID"></el-option>
      <el-option
        label="gene name"
        value="gene name"
        :disabled="true"
      ></el-option>
    </el-select>
    <p>&#10;</p>
    <el-form-item
      prop="gene_region"
      v-show="gene_filter == 'genomic region'"
      style="margin-left: 25px"
    >
      <el-input
        placeholder="chr11:5205263-5381894"
        v-model="form.gene_region"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item
      prop="gene_ensgs"
      v-show="gene_filter == 'Ensembl gene ID'"
      style="margin-left: 25px"
    >
      <el-input
        v-model="form.gene_ensgs"
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 10 }"
        placeholder="ENSG00000014919&#10;ENSG00000055950&#10;ENSG00000075826&#10;ENSG00000095485"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item
      prop="gene_name"
      v-show="gene_filter == 'gene name'"
      style="margin-left: 25px"
    >
      <el-input
        v-model="form.gene_name"
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 10 }"
        placeholder="CCN1&#10;ZNHIT6&#10;SH3GLB1&#10;GBP3"
        clearable
      ></el-input>
    </el-form-item>

    <h3 style="text-align: left; padding-left: 15px">Target filter</h3>
    <el-select v-model="target_filter" clearable>
      <el-option label="genomic region" value="genomic region"></el-option>
      <el-option
        v-if="organism == 'Homo sapiens'"
        label="dbSNP rsID"
        value="dbSNP rsID"
        :disabled="true"
      ></el-option>
      <el-option
        v-if="organism == 'Homo sapiens' || organism == 'Mus musculus'"
        label="ENCODE SCREEN ccRE"
        value="ENCODE SCREEN ccRE"
        :disabled="true"
      ></el-option>
    </el-select>
    <p>&#10;</p>
    <el-form-item
      prop="target_region"
      v-show="target_filter == 'genomic region'"
      style="margin-left: 25px"
    >
      <el-input
        placeholder="chr11:5205263-5381894"
        v-model="form.target_region"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item
      prop="target_rsid"
      v-show="target_filter == 'dbSNP rsID'"
      style="margin-left: 25px"
    >
      <el-input
        v-model="form.target_rsid"
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 10 }"
        placeholder="rs367896724&#10;rs540431307&#10;rs555500075&#10;rs548419688"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item
      prop="target_encode"
      v-show="target_filter == 'ENCODE SCREEN ccRE'"
      style="margin-left: 25px"
    >
      <el-input
        v-model="form.target_encode"
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 10 }"
        placeholder="EH38E1516972&#10;EH38E1516978&#10;EH38E1516968&#10;EH38E1516908"
        clearable
      ></el-input>
    </el-form-item>

    <h3 style="text-align: left; padding-left: 15px">Interaction filter</h3>
    <p style="text-align: left; padding-left: 25px; width: 240px">
      significant only
      <el-switch v-model="form.significant" style="float: right"></el-switch>
    </p>

    <!--     <p style="text-align: left; padding-left: 25px">distance</p>
    <el-input
      v-model="form.distance_low"
      clearable
      style="width: 100px"
    ></el-input>
    &nbsp;<i class="el-icon-minus"></i>&nbsp;
    <el-input
      v-model="form.distance_high"
      clearable
      style="width: 100px"
    ></el-input>

    <p style="text-align: left; padding-left: 25px">fraction change</p>
    <el-input v-model="form.fc_low" clearable style="width: 100px"></el-input>
    &nbsp;<i class="el-icon-minus"></i>&nbsp;
    <el-input v-model="form.fc_high" clearable style="width: 100px"></el-input> -->
  </el-form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EXFilter from "@/components/EXFilter.vue";
import biosamplesJson from "../jsons/biosamples.json";
import experimentsJson from "../jsons/experiments.json";

const getRegion = (value) => {
  if (!value || value.length == 0) {
    return null;
  }
  let region = value.replace(",", "").trim().split(/[:-]/);
  if (
    /^chr(([0-9]+)|([A-Z]+))$/.test(region[0]) &&
    /^\d+$/.test(region[1]) &&
    /^\d+$/.test(region[2])
  ) {
    let start = parseInt(region[1]);
    let end = parseInt(region[2]);
    if (start >= 0 && start < end) {
      return { chromosome: region[0], start: start, end: end };
    }
  }
  return null;
};

const getENSGs = (value, organism) => {
  const regs = {
    "Homo sapiens": /^ENSG\d{11}$/,
    "Mus musculus": /^ENSMUSG\d{11}$/,
  };
  if (!value) {
    return [];
  }
  value = value.replace(/[,;]/, " ").trim();
  if (value.length == 0) {
    return [];
  }
  value = value.split(/\s+/);
  let ensgs = [];
  for (let i in value) {
    let ensg = value[i].trim().split(".")[0];
    if (!regs[organism].test(ensg)) {
      return null;
    }
    ensgs.push(ensg);
  }
  return ensgs;
};

export default defineComponent({
  components: {
    EXFilter,
  },
  data() {
    const checkGeneRegion = (rule, value: string, callback) => {
      if (value && this.gene_filter == "genomic region") {
        if (!getRegion(value)) {
          callback(new Error("please check input format"));
          return;
        }
      }
      callback();
      return;
    };

    const checkTargetRegion = (rule, value: string, callback) => {
      if (value && this.target_filter == "genomic region") {
        if (!getRegion(value)) {
          callback(new Error("please check input format"));
          return;
        }
      }
      callback();
      return;
    };

    const checkGeneENSGs = (rule, value: string, callback) => {
      if (value && this.gene_filter == "Ensembl gene ID") {
        let ensgs = getENSGs(value, this.organism);
        if (!ensgs) {
          callback(new Error("please input Ensembl gene ID(s)"));
          return;
        }
        if (ensgs.length > 100) {
          callback(new Error("query < 100 genes at the same time"));
          return;
        }
      }
      callback();
      return;
    };

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
      gene_filter: "",
      target_filter: "",

      // value
      organism: "Homo sapiens",
      form: {
        gene_region: "",
        gene_ensgs: "",
        gene_name: "",
        target_region: "",
        target_rsid: "",
        target_encode: "",
        significant: true,
        distance_low: null,
        distance_high: null,
        fc_low: null,
        fc_high: null,
      },

      // rule
      rules: {
        gene_region: [
          { validator: checkGeneRegion, trigger: "blur" },
          { validator: checkGeneRegion, trigger: "clear" },
        ],
        gene_ensgs: [
          { validator: checkGeneENSGs, trigger: "blur" },
          { validator: checkGeneENSGs, trigger: "clear" },
        ],
        targer_region: [
          { validator: checkTargetRegion, trigger: "blur" },
          { validator: checkTargetRegion, trigger: "clear" },
        ],
      },
    };
  },
  methods: {
    onBiosampleChange() {
      this.organism = this.$refs.exfilter.biosample[0];
    },
    onSearchApply() {
      this.$emit("searchApply");
    },
    async applyFilters() {
      let experiments = await this.$refs.exfilter.applyFilters();

      let query = Object.fromEntries(Object.entries(this.$route.query));
      let filters = {
        organism: this.organism,
      };

      let all_experiments = Object.entries(experimentsJson).filter(
        ([e, info]) => {
          return info.ORGANISM == this.organism;
        }
      ).length;
      if (experiments.length < all_experiments) {
        filters["experiments"] = experiments;
      }

      delete query["gene_region"];
      if (this.gene_filter == "genomic region") {
        let gene_region = getRegion(this.form.gene_region);
        if (gene_region) {
          this.form.gene_region =
            gene_region.chromosome +
            ":" +
            gene_region.start +
            "-" +
            gene_region.end;
          query["gene_region"] = this.form.gene_region;
          filters["gene_region"] = gene_region;
        }
      }

      delete query["genes"];
      if (this.gene_filter == "Ensembl gene ID") {
        let gene_ensgs = getENSGs(this.form.gene_ensgs, this.organism);
        if (gene_ensgs && gene_ensgs.length > 0) {
          this.form.gene_ensgs = gene_ensgs.join("\n");
          query["genes"] = gene_ensgs.join(",");
          filters["genes"] = gene_ensgs;
        }
      }

      delete query["target_region"];
      if (this.target_filter == "genomic region") {
        let target_region = getRegion(this.form.target_region);
        if (target_region) {
          this.form.target_region =
            target_region.chromosome +
            ":" +
            target_region.start +
            "-" +
            target_region.end;
          query["target_region"] = this.form.target_region;
          filters["target_region"] = target_region;
        }
      }

      delete query["significant"];
      if (this.form.significant) {
        query["significant"] = true;
        filters["significant"] = true;
      }

      await this.$router.replace({
        path: this.$route.path,
        query: query,
      });
      return filters;
    },

    loadFilters() {
      this.$refs.exfilter.loadFilters();
      this.organism = this.$refs.exfilter.biosample[0];
      if ("gene_region" in this.$route.query) {
        this.form.gene_region = this.$route.query["gene_region"];
        this.gene_filter = "genomic region";
      }
      if ("genes" in this.$route.query) {
        this.form.gene_ensgs = this.$route.query["genes"].split(",").join("\n");
        this.gene_filter = "Ensembl gene ID";
      }
      if ("target_region" in this.$route.query) {
        this.form.target_region = this.$route.query["target_region"];
        this.target_filter = "genomic region";
      }

      if (
        "significant" in this.$route.query &&
        this.$route.query["significant"] == "true"
      ) {
        this.form.significant = true;
      }
    },
  },
});
</script>
