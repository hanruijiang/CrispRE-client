<template>
  <h1>&#10;</h1>
  <el-row>
    <el-col :span="15" :offset="1">
      <h1 style="text-align: left; word-break: keep-all">
        CrispRE: a manually curated database of CRISPR-based interactions
        between cis-regulatory elements and target genes
      </h1>

      <h3 style="text-align: left; word-break: keep-all; font-weight: normal">
        CrispRE is a manually curated database aiming to provide a comprehensive
        and accurate collection of CRISPR-based functional regulatory element
        experiments results.

        <h4>&#10;</h4>

        With the developments of CRISPR/Cas9-based technologies, the function of
        regulatory elements can be defined more precisely by this new paradigm
        in the functional screening of the genome with superior speed.
        Therefore, we reviewed literature that used CRISPR technology to
        identify regulatory elements and their target genes, and manually
        curated a database, including CRISPR-based interactions between
        cis-regulatory elements and target genes.

        <h4>&#10;</h4>

        CrispRE is still under development. We will add more interactions from
        other 22 publications, add interaction visualization through the genome
        browser, and add two query functions, such as querying through dbSNP
        rsID and ENCODE SCREEN ccRE ID.
      </h3>

      <div style="margin-left: auto; margin-right: auto; width: 450px">
        <img alt="biosamples" src="../assets/biosamples.png" />
      </div>
    </el-col>

    <el-col :span="6" :offset="1">
      <el-card shadow="hover">
        <template #header>
          <h2 style="text-align: left; word-break: keep-all">
            What can CrispRE do
          </h2>
        </template>

        <h3 style="text-align: left; word-break: keep-all; font-weight: normal">
          CrispRE provides a user-friendly interface for browsing the
          relationships between genes and candidate regulatory elements measure
          by CRISPR technology. Both the query for gene ID and genomic region
          are supported.

          <h4>&#10;</h4>

          Visitors can easily explore the regulatory elements of interesting
          genes or compare the effect size of one regulatory element when
          perturbed with different strategies or in different biosamples.

          <h4>&#10;</h4>

          Furthermore, CrispRE also provides an accurate dataset for developing
          the computational methods to predict interactions between regulatory
          elements and target genes.
        </h3>

        <router-link to="/interactions"
          ><h1>
            <el-button type="primary" style="width: 250px"
              ><h3>Browse Interactions</h3></el-button
            >
          </h1></router-link
        >

        <router-link to="/experiments"
          ><h1>
            <el-button type="primary" style="width: 250px"
              ><h3>Browse Experiments</h3></el-button
            >
          </h1></router-link
        >
      </el-card>
    </el-col>

    <el-col :span="22" :offset="1">
      <el-card shadow="hover">
        <template #header>
          <h2 style="text-align: left; word-break: keep-all">Summary</h2>
        </template>

        <h3 style="text-align: left; word-break: keep-all; font-weight: normal">
          The current version of the CrispRE database includes 117485 regulatory
          interactions between human 17079 genes and 7387 perturbation targets,
          as well as 44 interactions between 12 genes and 8 perturbation targets
          for mice.

          <h4>&#10;</h4>

          For each interaction, CrispRE recorded detailed information about its
          biosamples, perturbation, phenotype measurements, and statistics. Each
          regulatory element in the CrispRE database contains detailed location,
          gRNA sequence, and CRISPR construct.

          <h4>&#10;</h4>

          Furthermore, for candidate regulatory elements, we also compared the
          expression of genes before and after CRISPR-based DNA perturbation.
        </h3>

        <img
          style="width: 30%"
          fit="scale-down"
          alt="distribution"
          src="../assets/distribution.png"
        />

        <img
          style="width: 30%"
          fit="scale-down"
          alt="length"
          src="../assets/length.png"
        />

        <img
          style="width: 30%"
          fit="scale-down"
          alt="related"
          src="../assets/related.png"
        />
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Home",
  components: {},
};
</script>
