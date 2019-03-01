<template>
  <div id="app">
    <router-link to="/login"></router-link>
    <router-link to="/register"></router-link>
    <router-link to="/forget"></router-link>
    <router-link to="/index"></router-link>
    <router-link to="/edit"></router-link>
    <router-view></router-view>
  </div>
</template>

<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #efefef;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
