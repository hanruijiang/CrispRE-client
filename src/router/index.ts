import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/submit",
    name: "Submit",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/Submit.vue"),
  },
  {
    path: "/interactions",
    name: "Interactions",
    component: () => import("../views/Interactions.vue"),
  },
  {
    path: "/experiments",
    name: "Experiments",
    component: () => import("../views/Experiments.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  //   history: createWebHashHistory(),
  routes,
});

export default router;
