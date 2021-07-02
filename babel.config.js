module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    ["@babel/plugin-transform-runtime"],
    [
      "import",
      {
        libraryName: "element-plus",
        customStyleName: (name) => {
          return `element-plus/lib/theme-chalk/${name}.css`;
        },
      },
    ],
  ],
};
