<template>
  <div class="container">
    <div class="add-wrapper" v-if="!quList.length">
      <p @click="$router.push({name: 'edit',params: {id: 0}})">+ 新建问卷</p>
    </div>
    <div class="list-wrapper" v-else>
      <ul>
        <li></li>
        <li>标题</li>
        <li>截止时间</li>
        <li>状态</li>
        <li>操作
          <p @click="$router.push({name: 'edit',params: {id: 0}})">+ 新建问卷</p>
        </li>
      </ul>
      <ul v-for="item in quList" :key="item.id">
        <li @click="checkItem(item)">
          <i :class="{'checked': item.checked}"></i>
        </li>
        <li v-text="item.title"></li>
        <li v-text="item.time"></li>
        <li v-text="item.stateName" :class="{'releasing': (item.state === 1)}"></li>
        <li>
          <router-link tag="span" :to="`/fill/${item._id}`">查看问卷</router-link>
          <span v-if="!item.state" @click="editItem(item)">编辑</span>
          <router-link tag="span" v-else :to="`/data/${item._id}`">查看数据</router-link>
          <span @click="iterator=deleteItem(item);iterator.next();">删除</span>
        </li>
      </ul>
      <div>
        <p @click="checkAll(isCheckedAll)">
          <i :class="{'checked': isCheckedAll}"></i>
        </p>
        <p>
          全选
          <span @click="iterator=deleteCheckedItems();iterator.next();">删除</span>
        </p>
      </div>
    </div>
    <div class="overlay" v-show="isShowPrompt">
      <div class="prompt-box">
        <header>
          <span>提示</span>
          <a href="javascript:;" @click="isShowPrompt = false">&times;</a>
        </header>
        <p>{{ promptText }}</p>
        <footer>
          <span @click="iterator.next();isShowPrompt = false">确定</span>
          <span @click="isShowPrompt = false">取消</span>
        </footer>
      </div>
    </div>
    <div class="overlay1" v-show="isShowPrompt1">
      <div class="prompt-box1">
          {{promptText1}}
      </div>
    </div>
  </div>
</template>

<style  scoped >
.container {
  width: 100%;
  display: flex;
  height: 100%;
}

.add-wrapper {
  width: 80%;
  margin: 50px auto;
  height: 29rem;
  background-color: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.add-wrapper p {
  display: block;
  width: 8%;
  height: 5%;
  padding: 1rem 3rem;
  background-color: #60bdfa;
  text-align: center;
  color: #fff;
  margin-left: 40%;
  cursor: pointer;
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

.list-wrapper ul:first-of-type {
  background-color: #f2f2f2;
}

.list-wrapper ul {
  display: flex;
  height: 4rem;
  line-height: 4rem;
}

.list-wrapper ul li:first-of-type {
  text-align: left;
  flex: 1;
}

.list-wrapper ul li:nth-of-type(2) {
  text-align: left;
  flex: 4;
  font-size: 0.8rem;
}

.list-wrapper ul li:nth-of-type(3) {
  flex: 2.5;
  font-size: 0.8rem;
  text-align: left;
}

.list-wrapper ul li:nth-of-type(4) {
  flex: 1;

  font-size: 0.8rem;
}

.list-wrapper ul li:nth-of-type(5) {
  flex: 6;
  font-size: 0.8rem;
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

.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
}

.overlay1 {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.overlay .prompt-box {
  position: fixed;
  top: 40%;
  left: 50%;
  width: 25rem;
  height: 18rem;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 5px #ccc;
}

.overlay1 .prompt-box1 {
  position: fixed;
  top: 40%;
  left: 50%;
  width: 8rem;
  height: 2rem;
  line-height: 2rem;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  background-color: #60bdfa;
  box-shadow: 0 0 5px #ccc;
  text-align: center;
  color: #fff;
  
}

.overlay .prompt-box header {
  display: flex;
  height: 4rem;
  padding: 0 2rem;
  font-weight: 800;
  font-size: 1.5rem;
  line-height: 4rem;
  background-color: #f2f2f2;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.overlay .prompt-box header a {
  color: #555;
}

a {
  text-decoration: none;
}

.overlay .prompt-box p {
  padding: 3rem 2rem 4rem;
}

p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}

.overlay .prompt-box footer {
  text-align: center;
}

.overlay .prompt-box footer span:first-of-type {
  color: #fff;
  border-color: #c26206;
  background-color: #f07600;
}

.overlay .prompt-box footer span {
  width: 5rem;
  margin: 0.5rem;
}

.overlay .prompt-box footer span {
  display: inline-block;
  width: 7.5rem;
  height: 2rem;
  font-size: 1rem;
  line-height: 2rem;
  cursor: pointer;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: #fff;
}

.overlay .prompt-box footer span:nth-of-type(2) {
  color: #555;
  background-color: #fff;
}
</style>

<script>
import Vue from "vue";
import { setCookie, getCookie, delCookie } from "@/assets/js/cookie.js";
export default {
  data() {
    return {
      user: {
        username: ""
      },
      quList: [],
      iterator: {},
      isShowPrompt: false,
      promptText: "",
      promptText1:'',
      quList1:{
        id:''
      },
      isShowPrompt1:false,
      all:{
        checkList:[],
      }
    };
  },

  created() {
    let uname = getCookie("username");
    this.user.username = uname;
    this.$http
      .post("api/findquestion", JSON.stringify(this.user))
      .then(function(res) {
        this.quList = res.body.data;
      });
    this.quList.forEach(item => {
      if (item.state === 1) {
        let itemTime = new Date(item.time.replace(/-/g, ",")) * 1;
        if (itemTime < curTime) {
          item.state = 2;
          item.stateName = "已结束";
        }
      }
    });
  },

  methods: {
    checkItem(item, flag = null) {
      if (typeof item.checked === "undefined") {
        Vue.set(item, "checked", true);
      } else if (flag !== null) {
        item.checked = !flag;
      } else {
        item.checked = !item.checked;
      }
    },

    checkAll(flag) {
      this.quList.forEach(item => {
        this.checkItem(item, flag);
      });
    },

    showPrompt(text) {
      this.promptText = text;
      this.isShowPrompt = true;
    },

    *deleteItem(item) {
      yield this.showPrompt(`确认要删除《${item.title}》？`);
      this.quList1.id = item._id;
      this.$http.post("api/deletequestion",JSON.stringify(this.quList1)).then(function(res){
        if(res.body.message == '删除成功'){
         this.isShowPrompt1 = true;
         this.promptText1 = res.body.message;
         let index = this.quList.indexOf(item);
         this.quList.splice(index, 1);
         setTimeout(()=>{
             this.isShowPrompt1 = false;
         },1000)
        }
        else{
          this.isShowPrompt1 = true;
          this.promptText1 = res.body.message;
          setTimeout(()=>{
             this.isShowPrompt1 = false;
         },1000)
        }
      })   
    },

    *deleteCheckedItems() {
      let checkedList = this.quList.filter(item => item.checked);
      if (!checkedList.length) {
        alert("请选中一个问卷");
        return;
      }
      for(var i=0;i<checkedList.length;i++){
        this.all.checkList[i] = checkedList[i]._id;
      }
      yield this.showPrompt("确认要删除所选问卷？");
      this.$http.post("api/deletecheck",JSON.stringify(this.all))
      .then(function(res) {
        if(res.body.message == '删除成功'){
         this.isShowPrompt1 = true;
         this.promptText1 = res.body.message;
         this.quList = this.quList.filter(item => !item.checked);
         setTimeout(()=>{
             this.isShowPrompt1 = false;
         },1000)
        }
        else{
          this.isShowPrompt1 = true;
         this.promptText1 = res.body.message;
         setTimeout(()=>{
             this.isShowPrompt1 = false;
         },1000)
        }
      });
      
    },

    editItem(item) {
      this.showPrompt(`确认要编辑《${item.title}》？`);
      this.$router.push({ name: "Edit", params: { id: item.id } });
    }
  },

  computed: {
    isCheckedAll() {
      return this.quList.every(item => item.checked);
    }
  },

  watch: {
    quList: {
      handler(list) {
        list.forEach((item, index) => (item.id = index + 1));
      },
      deep: true
    }
  }
};
</script>