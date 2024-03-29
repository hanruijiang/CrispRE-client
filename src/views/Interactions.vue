<template>
  <el-container>
    <el-aside witdh="250px">
      <Search ref="search" @search-apply="search"></Search>
    </el-aside>

    <el-main>
      <div style="width: 100%; display: flex; justify-content: space-between">
        <el-space>
          <el-tooltip
            class="item"
            effect="dark"
            content="select columns"
            placement="top-start"
          >
            <el-select
              v-model="columns"
              class="column_selector"
              multiple
              style="width: 50px; margin-right: 12px"
              size="small"
            >
              <template #prefix
                ><i style="font-size=20px" class="el-icon-s-operation"></i
              ></template>

              <el-option-group
                v-for="group in result_columns"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-option-group>
            </el-select>
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            content="download current page in .csv format. will available after published."
            placement="top-start"
          >
            <el-button plain type="primary" size="small">.csv</el-button>
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            content="download all results in .csv.gz format. will available after published."
            placement="top-start"
          >
            <el-button plain type="primary" size="small">.gz</el-button>
          </el-tooltip>
        </el-space>

        <el-pagination
          v-show="total > 0"
          @current-change="changePage"
          v-model:currentPage="page"
          :page-size="page_size"
          layout="total, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>

      <Result
        v-show="total > 0"
        :current-index="(page - 1) * page_size + 1"
        :organism="'Homo sapiens'"
        :columns="columns"
        :interactions="interactions"
      ></Result>

      <h2 v-show="total == 0">
        No interactions were found, please try other options
      </h2>

      <Interaction ref="interaction"></Interaction>
    </el-main>
  </el-container>
</template>

<script>
import Search from "@/components/Search.vue";
import Result from "@/components/Result.vue";
import Interaction from "@/components/Interaction.vue";

import { getInteractions, getExperiment } from "../plugins/utils";

export default {
  components: {
    Search,
    Result,
    Interaction,
  },
  data() {
    return {
      // result ui
      page_size: 25,
      result_columns: [
        {
          label: "experiment",
          options: [
            "experiment",
            "organ",
            "biosample",
            "perturbation",
            "phenotype",
          ],
        },
        {
          label: "gene",
          options: ["gene", "Ensembl gene ID", "gene region", "gene strand"],
        },
        { label: "target", options: ["target region"] },
        {
          label: "interaction",
          options: [
            "distance",
            "fraction change",
            "p-value",
            "q-value",
            "significant",
          ],
        },
        //         { label: "external", options: ["related SNPs", "related ccREs"] },
      ],
      columns: [
        "experiment",
        "biosample",
        "gene",
        "target region",
        "distance",
        "fraction change",
        "significant",
      ],
      // result
      filters: {},
      total: 0,
      page: 1,
      interactions: [],
      total_experiments: 0,
    };
  },
  mounted() {
    let filters = this.$refs.interaction.loadFilters();
    if (filters.experiment != null) {
      this.$refs.interaction.applyFilters(filters);
      return;
    }

    this.$refs.search.loadFilters();
    this.$refs.search.applyFilters().then((filters) => {
      if ("page" in this.$route.query) {
        filters.page = Math.max(1, parseInt(this.$route.query["page"]));
      }
      this.apply(filters);
    });
  },
  methods: {
    apply(filters) {
      if (JSON.stringify(filters) === JSON.stringify(this.filters)) {
        return new Promise((r) => {
          r(false);
        });
      }

      this.filters = filters;

      if (
        "experiments" in this.filters &&
        this.filters.experiments.length == 0
      ) {
        this.total = 0;
        this.page = 1;
        this.interactions = [];
        this.total_experiments = 0;
        return new Promise((r) => {
          r(false);
        });
      }

      return getInteractions(this.filters).then((res) => {
        this.total = res.total;
        this.page = res.page;
        this.interactions = res.interactions;
        this.total_experiments = res.total_experiments;
        this.filters.page = res.page;

        return this.$router
          .replace({
            path: this.$route.path,
            query: { ...this.$route.query, page: this.page },
          })
          .then(() => {
            return true;
          });
      });
    },
    async search() {
      let filters = await this.$refs.search.applyFilters();
      filters.page = 1;
      this.apply(filters);
    },
    changePage() {
      this.apply({ ...this.filters, page: this.page });
    },
  },
};
</script>

<style>
.column_selector .el-tag {
  display: none;
}
</style>
