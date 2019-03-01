import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    needLogin:true
  },
  mutations: {
    change(state,text){
      state.needLogin = text
    }
  },
  actions: {},
});
