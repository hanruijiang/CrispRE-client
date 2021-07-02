module.exports = {
  devServer: {
    open: true,
    host: "10.70.143.126",
    // host: "localhost",
    port: 1038,
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      "/api/": {
        target: "http://10.70.143.126:9002/",
        secure: false,
        pathRewrite: {
          "^/api/": "",
        },
        changeOrigin: true,
        logLevel: "debug",
      },
    },
  },
};
