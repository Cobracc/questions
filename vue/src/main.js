import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueResource from 'vue-resource';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import echarts from 'echarts'
Vue.prototype.$echarts = echarts 

Vue.use(ElementUI)
Vue.use(VueResource)
Vue.config.productionTip = false;

router.beforeEach((to,from,next)=>{
  if(to.meta.needLogin){
    next({path:'/login'})
  }
  else{
    next()
  }
})



Vue.http.options.root = 'http://127.0.0.1:8080';
Vue.http.options.emulateJSON = true;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
