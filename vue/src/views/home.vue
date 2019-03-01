<template>
  <div class="container">
    <headercc></headercc>
    <div class="sousuo">
      <el-input style="width:500px" placeholder="请输入关键词" v-model="message"></el-input>
      <el-button type="primary" @click="search()">查询</el-button>
    </div>
    <p style="font-size:1.6rem">问卷示例</p>
    <div v-if="showsrach" class="list-wrapper">
      <ul>
        <li>标题</li>
        <li style="margin-left:20rem">操作
          <p @click="$router.push({name: 'edit',params: {id: 0}})">+ 新建问卷</p>
        </li>
      </ul>
      <ul v-for="item in quList" :key="item.id">
        <li v-text="item.title"></li>
        <li>
          <router-link tag="span" :to="`/fill/${item._id}`">查看问卷</router-link>
          <router-link tag="span" :to="`/data/${item._id}`">查看数据</router-link>
        </li>
      </ul>
    </div>
    <div v-else class="list-wrapper1">
        很抱歉，没有搜索到相关的问卷模板，请更换关键词重新搜索！
    </div>
  </div>
</template>



<style scoped>
.container {
  width: 100%;
  color: #555;
  height: 100%;
}

.sousuo {
  width: 100%;
  display: inline-block;
  height: 4rem;
}

.list-wrapper {
  width: 90%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 5px #ccc;
}

.list-wrapper1 {
  width: 90%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 5px #ccc;
}

.list-wrapper ul:first-of-type {
  background-color: #f2f2f2;
}

.list-wrapper ul {
  display: flex;
  height: 4rem;
  line-height: 4rem;
  margin: -5px auto;
}

.list-wrapper ul li:first-of-type {
  text-align: center;
  flex: 2;
}

.list-wrapper ul li:nth-of-type(2) {
  text-align: center;
  flex: 4;
  font-size: 1rem;
}

.list-wrapper ul:first-of-type p {
  display: inline-block;
  width: 6rem;
  height: 2rem;
  margin-left: 10rem;
  line-height: 2rem;
  text-align: center;
  cursor: pointer;
  color: #fff;
  border: 1px solid #60bdfa;
  border-radius: 5px;
  background-color: #60bdfa;
}

.list-wrapper i.checked {
  border: 0.4rem solid #f07600;
}

.list-wrapper i {
  display: inline-block;
  box-sizing: border-box;
  width: 1rem;
  height: 1rem;
  border: 1px solid #999;
  border-radius: 50%;
  background-color: #eee;
}

.list-wrapper ul span {
  display: inline-block;
  width: 6.5rem;
  height: 1.8rem;
  font-size: 0.8rem;
  line-height: 1.8rem;
  cursor: pointer;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: #fff;
}

ol,
ul {
  list-style: none;
}

.list-wrapper ul:not(:first-child) {
  border-bottom: 1px solid #eee;
}

.list-wrapper div {
  display: flex;
  height: 3.8rem;
  line-height: 1.8rem;
}

.list-wrapper div span {
  display: inline-block;
  width: 7rem;
  height: 1.8rem;
  font-size: 1rem;
  line-height: 1.8rem;
  cursor: pointer;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: #fff;
}

.list-wrapper div p:first-of-type {
  text-align: center;
  flex: 1;
}

.list-wrapper div p:nth-of-type(2) {
  flex: 14;
  text-align: left;
}

.list-wrapper div p:nth-of-type(2) span {
  margin-left: 2rem;
}

a {
  text-decoration: none;
}
</style>


<script>
import Vue from "vue";
import { setCookie, getCookie, delCookie } from "@/assets/js/cookie.js";
import headercc from "@/components/header.vue";
export default {
  data() {
    return {
      wenjuan: {
        state: 1
      },
      quList: [],
      iterator: {},
      promptText: "",
      message: "",
      showsrach:true
    };
  },
  components: {
    headercc
  },

  created() {
    this.showwenjuan();
  },

  methods: {
    showwenjuan() {
      this.$http
        .post("api/showwenjuan", JSON.stringify(this.wenjuan))
        .then(function(res) {
          console.log(res);
          console.log("111");
          this.quList = res.body.data;
        });
    },

    search() {
      let searchText = this.message;
      if (searchText == "") {
        return;
      } else {
        console.log(searchText)
        this.$http.get("api/search/" + searchText).then(res => {
          if(res.body.data.length >0 ){
              this.quList = res.body.data;
              this.showsrach = true;
          }
          else{
            this.showsrach = false;
          } 
        });
      }
    }
  }
};
</script>