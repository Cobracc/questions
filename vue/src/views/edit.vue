<template>
  <div class="container">
    <headercc></headercc>
    <div class="qu-wrap">
      <header>
        <span @click="iterator = backBtn(); iterator.next()">&lt; 返回</span>
        <p v-show="!titleEditing" @click="titleEditing = true">{{tempTitle}}</p>
        <input
          type="text"
          v-focus
          v-model="title"
          :class="{inlineShow: titleEditing}"
          @focus="_title = title"
          @blur="titleEditing = false"
          @keyup.enter="titleEditing = false"
        >
      </header>
      <div class="qu-content">
        <section
          class="qu-item"
          v-for="(item, index) in questions"
          :class="{nowEditing: curIndex === index , optEditing: curIndex1 === index}">
          <h3>
            <span class="qu-num">{{`问题${index + 1}`}}</span>
            <span class="qu-topic" 
            @click="curIndex=index; topicEditing = true"
            >{{item.topic}}</span>
            <input
              type="text"
              v-focus
              v-model="topic"
              @focus="_topic = topic"
              @blur="curIndex=''; topic=''"
              @keyup.esc="cancelTopicEdit()"
              @keyup.enter="doneTopicEdit(index)"
            >
            <span v-if="item.isMandatory" style="font-size:15px;color:red">*(必选)</span>
          </h3>
          <template v-if="item.type === 'textarea'">
            <textarea rows="8" cols="80"></textarea>
            <label id="require-check">
							<input type="checkbox"
							v-model:checked="item.isMandatory">
							此题是否必填
						</label>
          </template>
          <ul v-else class="options-list">
            <li
              v-for="(option, optIndex) in item.options"
              :key="option"
              :class="{optionEditing: curOptIndex === optIndex}"
            >
              <span
                class="optionText"
                @click="curIndex1=index; curOptIndex=optIndex; topicEditing = false"
              >{{ option }}</span>
              <input
                type="text"
                v-focus
                v-model="optionText"
                @focus="_optionText = optionText"
                @blur="curIndex=''; optionText=''"
                @keyup.esc="cancelOptionEdit()"
                @keyup.enter="doneOptionEdit(index, optIndex)"
              >

              <ul class="opt-ctrl">
                <li v-if="optIndex !== 0" @click="moveUp(optIndex, item.options)">上移</li>
                <li
                  v-if="optIndex !== item.options.length - 1"
                  @click="moveDown(optIndex, item.options)"
                >下移</li>
                <li v-else @click="addOption(item.options)">添加</li>
                <li @click="delOption(optIndex, item.options)">删除</li>
              </ul>
            </li>
            <label id="require-check">
							<input type="checkbox"
							v-model:checked="item.isMandatory">
							此题是否必填
						</label>
          </ul>
          <ul class="operat-list">
             <li v-if="index !== 0" @click="moveUp(index)">上移</li>
            <li v-if="index !== questions.length - 1" @click="moveDown(index)">下移</li>
            <li @click="reuse(index)">复用</li>
            <li @click="delQuestion(index)">删除</li>
          </ul>
          <div></div>
        </section>
        <div class="add-box">
          <p class="qu-type" :class="{expand: isAdding}">
            <span @click="addType('radio')">单选题</span>
            <span @click="addType('checkbox')">多选题</span>
            <span @click="addType('textarea')">文本题</span>
          </p>
          <p class="add-btn" @click="isAdding = !isAdding;">
            <span>+ 添加问题</span>
          </p>
        </div>
      </div>
      <footer>
        <div class="date-part">
          <label>
            问卷截止日期
            <el-date-picker
      v-model="date"
      type="date"
      placeholder="选择日期"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
       @blur="changeDate(date)">
    </el-date-picker>
          </label>
          <!-- <date-components id="date-picker" v-show="isShowDatepicker" @sendDate="changeDate"></date-components> -->
        </div>
        <div class="ctrl-part">
          <span @click="iterator = saveBtn(); iterator.next()">保存问卷</span>
          <span @click="iterator = releaseBtn(); iterator.next()">发布问卷</span>
        </div>
      </footer>
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
  </div>
</template>
<style scoped>
.container {
  width: 100%;
  color: #555;
  height: 100%;
}

#require-check {
    position: absolute;
    top: 1rem;
    right: 2rem;
    display: none;
}

.qu-content .qu-item:hover #require-check{
  display: block;
} 


.qu-wrap {
  margin: 3rem auto;
  box-sizing: border-box;
  padding: 1rem;
  width: 90%;
  background-color: #fff;
}

.qu-content .qu-item {
  position: relative;
  margin: 0 auto;
  padding: 1rem 2rem;
}

.qu-content .qu-item h3 {
  height: 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 2rem;
  text-align: left;
}

.qu-content .qu-item .qu-num {
  display: inline-block;
  width: 5rem;
}

.qu-content .qu-item h3 > input {
  display: none;
  width: 15rem;
  height: 2rem;
  font-size: 1.4rem;
  border: none;
  outline: none;
  background-color: #ccc;
}

.qu-content .options-list > li {
  height: 1.5rem;
  font-size: 1rem;
  line-height: 1.5rem;
  text-align: left;
  margin-left: 3rem;
}

.qu-content .options-list > li > input {
  display: none;
  width: 15rem;
  height: 1.5rem;
  font-size: 1rem;
  border: none;
  outline: none;
  background-color: #ccc;
}



.qu-content .qu-item:hover {
  background-color: #fcf0e5;
}

.qu-content .qu-item.optEditing .optionEditing .optionText {
  display: none;
}

.qu-content .qu-item.optEditing .optionEditing > input {
  display: inline-block;
}

.qu-content .options-list > li:hover ul {
  display: inline-flex;
  margin-left: 1.5rem;
}

.qu-content .options-list > li:hover li {
  margin-left: 1.5rem;
  font-size: 1rem;
  cursor: pointer;
}

.qu-content .options-list > li > ul {
  display: none;
}

ol,
ul {
  list-style: none;
}

.qu-content .operat-list li {
  margin-right: 1rem;
  cursor: pointer;
}

.qu-content .operat-list {
  display: none;
  height: 2rem;
  -ms-flex-pack: end;
  justify-content: flex-end;
}

article,
aside,
footer,
header,
hgroup,
main,
nav,
section {
  display: block;
}

.qu-content .qu-item:hover .operat-list {
  display: flex;
}

textarea {
  background-color: white;
  flex-direction: column;
  resize: auto;
  cursor: text;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  border-width: 1px;
  border-style: solid;
  border-color: initial;
  border-image: initial;
  padding: 2px;
  text-align: left;
  margin-left: -20rem;
}

.qu-wrap > header {
  position: relative;
  height: 4.5rem;
  line-height: 5rem;
  text-align: center;
}

.qu-wrap > header span {
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
}

.qu-wrap > header p {
  width: 50%;
  margin: 0 auto;
  font-size: 1.5rem;
  font-weight: 700;
}

.qu-wrap > header input {
  display: none;
  height: 100%;
  text-align: center;
  border: none;
  outline: none;
  background-color: #ccc;
}

.qu-wrap > header input.inlineShow {
  display: inline-block;
}

.qu-wrap > header input,
.qu-wrap > header p {
  width: 50rem;
  margin: 0 auto;
  font-size: 1.5rem;
  font-weight: 700;
}

.qu-content {
  padding: 1rem;
  border-top: 2px solid #bbb;
  border-bottom: 2px solid #bbb;
}

.add-box {
  border: 1px solid #ccc;
}

.add-box .qu-type {
  overflow: hidden;
  height: 0;
  transition: height 0.5s;
}

.add-box .add-btn,
.add-box .qu-type {
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-box .add-btn {
  padding: 1.5rem 0;
  font-size: 1.2rem;
  cursor: pointer;
  background-color: #eee;
}

.add-box .qu-type span {
  margin: 0 3rem;
  padding: 0.5rem 4rem;
  cursor: pointer;
  border: 1px solid #ccc;
  background-color: #eee;
  text-align: center;
}

.add-box .qu-type.expand {
  height: 4rem;
}

.qu-wrap > footer {
  display: flex;
  padding: 2rem 5rem;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.qu-wrap > footer .date-part {
  position: relative;
}

.qu-wrap > footer .date-part input {
  display: inline-block;
  box-sizing: border-box;
  width: 15rem;
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border: 1px solid #ccc;
  outline: none;
}

label {
  cursor: default;
}

.qu-wrap > footer .ctrl-part span:first-of-type {
  color: #555;
  background-color: #fff;
}

.qu-wrap > footer .ctrl-part span:nth-of-type(2) {
  color: #fff;
  border-color: #c26206;
  background-color: #f07600;
}

.qu-wrap > footer .ctrl-part span {
  margin: 0 1rem;
}

.qu-wrap > footer .ctrl-part span {
  display: inline-block;
  width: 6.5rem;
  height: 2rem;
  font-size: 1rem;
  line-height: 2rem;
  cursor: pointer;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: #fff;
}

.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
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

.qu-content .qu-item.nowEditing .qu-topic {
  display: none;
}

.qu-content .qu-item.nowEditing h3 > input {
  display: inline-block;
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
import headercc from "@/components/header.vue";
import { setCookie, getCookie, delCookie } from "@/assets/js/cookie.js";
export default {
  name: "edit",
  components: {
    headercc
  },
  data() {
    return {
      index: -1,
      display:true,
      quData: {},
      questions: [],
      questionTemplate: {},
      quList: [],
      date: "",
      title: "",
      _title: "",
      topic: "",
      _topic: "",
      optionText: "",
      _optionText: "",
      curIndex: "",
      curOptIndex: "",
      promptText: "",
      iterator: {},
      isAdding: false,
      titleEditing: false,
      topicEditing: false,
      isShowPrompt: false,
      isShowDatepicker: false,
      template: {
        radio: {
          type: "radio",
          topic: "单选题",
          options: ["选项1", "选项2", "选项3", "选项4"]
        },
        checkbox: {
          type: "checkbox",
          topic: "多选题",
          options: ["选项1", "选项2", "选项3", "选项4"]
        },
        textarea: {
          type: "textarea",
          topic: "文本题",
          isMandatory: false
        }
      }
    };
  },

  beforeRouterEnter(to, from, next) {
    
  },

  created() {
    this.getData();
    this.title1 = "这里是问卷题目";
    let uname = getCookie("username");
    if(uname == ''){
      this.$router.push("/login")
    }
    else{
      this.$router.push("/edit")
    }
  },

  computed: {
    tempTitle() {
      if (this.title == "") {
        return this.title1;
      } else {
        return this.title;
      }
    }
  },

  methods: {
    changeDisplay(){
      //this.index=curIndex;
    },
    getData() {
      let item = {};
      item.title = `这里是问卷题目`;
      item.state = 0;
      item.stateName = "未发布";
      item.time = "";
      item.questions = [];
      this.quData = item;
      this.date = this.quData.time;
      this.title = this.quData.title;
      this.index = this.quData.id - 1;
      this.questionTemplate = this.template;
      this.questions = [...this.quData.questions];
    },

    changeDate(date) {
      let nowTime = Date.now();
      if (date < nowTime) {
        this.iterator = null;
        this.showPrompt(`选择的日期不能早于当前日期，请重新选择！`);
        this.date = nowTime;
        return;
      }
      this.date = date;
      return;
    },

    cancelTitleEdit() {
      this.titleEditing = false;
      this.title = this._title;
    },

    cancelTopicEdit() {
      this.topicEditing = false;
      this.topic = this._topic;
    },

    cancelOptionEdit() {
      this.curOptIndex = "";
      this.optionText = this._optionText;
    },

    doneTopicEdit(index) {
      this.topicEditing = false;
      this.questions[index].topic = this.topic;
    },

    doneOptionEdit(index, optIndex) {
      this.curOptIndex = "";
      this.isActive = false;
      this.questions[index].options[optIndex] = this.optionText;
    },

    switchItem(index, array) {
      this.optIndex = "";
      this.curIndex = "";
      let arr = array.splice(index, 2);
      array.splice(index, 0, ...arr.reverse());
    },

    moveUp(index, array) {
      console.log("index" + index);
      if(index<=0){
        return
      }
      const tempList = this.questions.concat([]);
      // ES6的解构赋值
      [tempList[index-1],tempList[index]] = [tempList[index],tempList[index-1]];
      this.questions = tempList;
     // this.switchItem(index - 1, array);
    },

    moveDown(index, array) {

      if(index>= this.questions.length+1){
        return
      }
      const tempList = this.questions.concat([]);
      [tempList[index+1],tempList[index]] = [tempList[index],tempList[index+1]];
      this.questions = tempList;
      //console.log("index1" + index);
      //this.switchItem(index, array);
    },

    errorPrompt(text) {
      this.iterator = null;
      this.showPrompt(text);
    },

    reuse(index) {
      if (this.questions.length === 20) {
        this.errorPrompt(`每份问卷至多20个问题！`);
        return;
      }
      let oldQuestion = this.questions[index];
      let newQuestion = JSON.parse(JSON.stringify(oldQuestion));
      this.questions.splice(index, 0, newQuestion);
    },

    delQuestion(index) {
      if (this.questions.length <= 1) {
        this.errorPrompt(`每份问卷至少一个问题！`);
        return;
      }
      this.questions.splice(index, 1);
    },

    delOption(index, options) {
      if (options.length <= 2) {
        this.errorPrompt(`每个问题至少两个选项`);
        return;
      }
      options.splice(index, 1);
    },

    addOption(options) {
      if (options.length === 8) {
        this.errorPrompt(`每个问题至多八个选项`);
        return;
      }
      options.push(`请编辑选项内容`);
    },

    showPrompt(text) {
      this.promptText = text;
      this.isShowPrompt = true;
    },

    addType(type) {
      if (this.questions.length === 20) {
        this.errorPrompt(`每份问卷至多20个问题！`);
        return;
      }
      this.questions.push(this.questionTemplate[type]);
    },

    saveData() {
      if (this.questions.length === 0) {
        this.errorPrompt(`每份问卷至少一个问题！`);
        return;
      } else {
        let uname = getCookie("username");
        if (uname == "") {
          this.$router.push("/login");
        } else {
          this.quData.username = uname;
        }
        this.quData.title = this.title;
        this.quData.time = this.date;
        this.quData.questions = [...this.questions];
        this.$http
          .post("api/savequestion", JSON.stringify(this.quData))
          .then(function(res) {});
      }
    },

    *backBtn() {
      yield this.showPrompt(`确认未保存回到主页吗？`);
      yield this.$router.push("/index");
    },

    *saveBtn() {
      yield this.showPrompt(`确认要保存问卷？`);
      this.saveData();
      this.$router.push("/index");
    },

    *releaseBtn() {
      yield this.showPrompt(`确认要保存并发布问卷？`);
      yield (() => {
        this.quData.state = 1;
        this.quData.stateName = "发布中";
        this.saveData();
        this.$router.push("/index");
      })();
    }
  },

  directives: {
    focus: {
      update: el => el.focus()
    }
  },

  watch: {
    quList: {
      handler(list) {
        this.iterator && this.iterator.next();
      }
    }
  }
};
</script>

