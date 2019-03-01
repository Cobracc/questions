<template>
  <header id="header">
    <h2 @click="godating()">CC问卷</h2>
    <h3 @click="goindex()">我的问卷</h3>
    <h4 v-if="!show" @click="goLogin()" style="margin-left:45rem;">登录/</h4>
    <h4 v-if="!show" @click="goRegister()">注册</h4>

    <h4 v-if="show" style="margin-left:45rem">欢迎您,{{name}}</h4>
    <a v-if="show" style="margin-left:1.5rem;" href @click="loginOut()">退出</a>
  </header>
</template>

<script>
import { setCookie, getCookie, delCookie } from "@/assets/js/cookie.js";
export default {
  name: "header",
  data() {
    return {
      name: "",
      show: false
    };
  },
  mounted() {
    /*页面挂载获取保存的cookie值，渲染到页面上*/
    let uname = getCookie("username");
    if (uname == "") {
      this.show = false;
    } else {
      this.name = uname;
      this.show = true;
    }
  },
  methods: {
    goLogin() {
      this.$router.push("/login");
    },
    goRegister() {
      this.$router.push("/register");
    },
    loginOut() {
      delCookie("username");
      this.show = false;
    },
    godating(){
      this.$router.push("/home");
    },
    goindex(){
      this.$router.push("/index");
    }
  }
};
</script>

<style scoped>
#header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  background-color: #60bdfa;
  color: #fff;
  margin: 0 auto;
  margin-left: 0;
  padding: 0;
  
}

#header h2 {
  margin: 0 5rem 0 6rem;
  font-size: 1.8rem;
  cursor: pointer;
}

#header h2:before {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  margin-right: 0.5rem;
  content: "?";
  color: #ee7419;
  text-align: center;
  background-color: #fff;
  border-radius: 50%;
}

#header h3 {
  font-size: 1.2rem;
  cursor: pointer;
}
#header h4 {
  font-size: 1rem;
  cursor: pointer;
}
</style>
