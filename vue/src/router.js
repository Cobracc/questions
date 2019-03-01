import Vue from "vue";
import Router from "vue-router";
import index from "@/views/index.vue"
import login from "@/views/login.vue";
import register from "@/views/register.vue";
import forget from "@/views/forget.vue";
import edit from "@/views/edit.vue";
import fill from "@/views/fill.vue";
import home from "@/views/home.vue";
import data from "@/views/Data.vue";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: home
    },
    {
      path: "/login",
      name: "login",
      component: login
    },
    {
      path: "/register",
      name: "register",
      component: register
    },
    {
      path: "/forget",
      name: "forget",
      component: forget
    },
    {
      path: "/index",
      name: "index",
      component: index
    },
    {
      path: "/home",
      name: "home",
      component: home
    },
    {
      path: "/edit",
      name: "edit",
      component: edit,
      //  meta:{
      //       needLogin:true
      //  }
    },
    {
      path: "/fill/:id",
      name: "fill",
      component: fill,
      // meta:{
      //   needLogin:true
      // }
    },
    {
      path: "/data/:id",
      name: "data",
      component: data,
      // meta:{
      //   needLogin:true
      // }
    },
  ]
});
