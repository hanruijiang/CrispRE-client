<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
  >
    <el-menu-item index="/">Home</el-menu-item>
    <el-menu-item index="/interactions">Interactions</el-menu-item>
    <el-menu-item index="/experiments">Experiments</el-menu-item>
    <!--     <el-menu-item index="/download">Download</el-menu-item> -->
    <el-menu-item index="/about">About</el-menu-item>
    <el-menu-item index="/submit">Submit</el-menu-item>
  </el-menu>

  <router-view />
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "/",
    };
  },
  watch: {
    $route(n, o) {
      if (n.path != o.path) {
        this.activeIndex = this.$route.path;
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
