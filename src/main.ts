import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import {
  ElButton,
  ElSelect,
  ElMenu,
  ElMenuItem,
  ElRow,
  ElCol,
  ElContainer,
  ElAside,
  ElMain,
  ElInput,
  ElSelect,
  ElOption,
  ElCard,
  ElTooltip,
  ElOptionGroup,
  ElPagination,
  ElSpace,
  ElLink,
  ElCascader,
  ElDialog,
  ElAffix,
  ElScrollbar,
  ElTable,
  ElTableColumn,
  ElForm,
  ElDivider,
  ElFormItem,
  ElSwitch,
  ElTag,
} from "element-plus";

// import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";

const app = createApp(App).use(router);

const components = [
  ElButton,
  ElSelect,
  ElMenu,
  ElMenuItem,
  ElRow,
  ElCol,
  ElContainer,
  ElAside,
  ElMain,
  ElInput,
  ElSelect,
  ElOption,
  ElCard,
  ElTooltip,
  ElOptionGroup,
  ElPagination,
  ElSpace,
  ElLink,
  ElCascader,
  ElDialog,
  ElAffix,
  ElScrollbar,
  ElTable,
  ElTableColumn,
  ElForm,
  ElDivider,
  ElFormItem,
  ElSwitch,
  ElTag,
];

components.forEach((component) => {
  app.component(component.name, component);
});

// app.use(ElementPlus);

app.mount("#app");
