<template>
  <div class="container">
    <div class="qu-wrap">
      <header>
        <span @click="iterator = backBtn()">&lt; 返回</span>
        <p>{{ quData[0].title }}</p>
      </header>
      <div class="qu-content">
        <section class="qu-item" v-for="(item, index) in questions" :key="item">
          <h3>
            {{ `问题${index + 1}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${item.topic}` }}
            <span style="line-height:10px;font-size:14px;color:red"
              v-if="item.isMandatory"
            >*(必选)</span>
          </h3>
          <textarea
            rows="8"
            cols="80"
            v-if="item.type === 'textarea'"
            v-model="item.answer"
            :required="item.isMandatory"
          ></textarea>
          <ul v-else class="options-list">
            <li v-for="(option, optIndex) in item.options" :key="option">
              <label>
                <input
                  v-if="item.type === 'radio'"
                  :type="item.type"
                  :name="index + 1"
                  @change="item.answer = optIndex"
                >
                <input
                  v-else
                  :type="item.type"
                  :name="index + 1"
                  @change="checkboxAnswer($event, optIndex, item.answer)"
                >
                <span>{{ option }}</span>
              </label>
            </li>
          </ul>
        </section>
      </div>
      <footer>
        <span id="submitBtn" @click="iterator = submitBtn(); iterator.next()">提交问卷</span>
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
          <span @click="isShowPrompt = false; iterator && iterator.next()">确定</span>
          <span @click="isShowPrompt = false">取消</span>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Fill",
  data() {
    return {
	  title:'',
      quData: {},
      questions: [],
      answers: {},
      promptText: "",
      isShowPrompt: false
    };
  },

  beforeRouterEnter(to, from, next) {
    let id = to.params.id;
    let item = {};
    if (id !== 0) {
      alert("非法路由");
      next("/");
    } else {
      next();
    }
  },

  created() {
    this.getData();
  },

  methods: {
    getData() {
      let id = this.$route.params.id;
      this.$http.get("api/findwenjuan?id=" + id).then(function(res) {
		this.quData = res.body.data;
        this.questions = this.quData[0].questionss;
        this.questions.forEach(item => {
          if (item.type === "checkbox") {
            item.answer = [];
          } else {
            item.answer = "";
          }
        });
      });
    },

    showPrompt(text) {
      this.promptText = text;
      this.isShowPrompt = true;
    },

    checkboxAnswer(event, index, answer) {
      if (event.target.checked) {
        answer.push(index);
      } else {
        answer.splice(answer.indexOf(index), 1);
      }
    },

    requireValidate() {
      let textareas = document.querySelectorAll("textarea");
      return [].every.call(textareas, item => {
        if (item.hasAttribute("required") && item.value.trim() === "") {
          return false;
        }
        return true;
      });
    },

    getAnswer() {
      this.questions.forEach((item, index) => {
        this.answers[`Q${index + 1}answer`] = item.answer;
      });
    },

    sendAnswer() {
      this.getAnswer();
      this.$router.push({ path: "/index" });
      console.log("非正式项目，无需发送用户回答数据，打印出来看看就好");
      console.log(this.answers);
    },

    *submitBtn() {
      let text = ``;
      if (this.quData.state === 0) {
        text = `问卷尚未发布，无法提交！`;
        this.iterator = null;
      } else if (!this.requireValidate()) {
        text = `有必填项未填写，无法提交！`;
        this.iterator = null;
      } else {
        text = `确认提交问卷吗？`;
      }

      yield this.showPrompt(text);
      yield this.sendAnswer();
    },

    backBtn() {
      
      this.$router.back(-1)
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  color: #555;
  height: 100%;
}

.qu-wrap {
  margin: 3rem auto;
  box-sizing: border-box;
  padding: 1rem;
  width: 90%;
  background-color: #fff;
}

.qu-wrap > header {
  position: relative;
  height: 5rem;
  margin: 0 2rem 2rem;
  line-height: 5rem;
  text-align: center;
}

.qu-wrap > header span {
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
}

.qu-wrap > header input,
.qu-wrap > header p {
  width: 50rem;
  margin: 0 auto;
  font-size: 1.8rem;
  font-weight: 700;
}

.qu-content {
  padding: 2rem;
  border-top: 2px solid #bbb;
  border-bottom: 2px solid #bbb;
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

ol,
ul {
  list-style: none;
}

.qu-content .options-list > li {
  height: 1.5rem;
  font-size: 1rem;
  line-height: 1.5rem;
  text-align: left;
  margin-left: 4rem;
}

label {
  cursor: default;
}

blockquote,
body,
dd,
div,
dl,
dt,
fieldset,
form,
h1,
h2,
h3,
h4,
h5,
h6,
input,
li,
ol,
p,
pre,
td,
textarea,
th,
ul {
  margin: 0;
  padding: 0;
}

input[type="radio" i] {
  -webkit-appearance: radio;
  box-sizing: border-box;
}

input[type="radio" i],
input[type="checkbox" i] {
  background-color: initial;
  cursor: default;
  margin: 3px 0.5ex;
  padding: initial;
  border: initial;
}

input[type="checkbox" i] {
  -webkit-appearance: checkbox;
  box-sizing: border-box;
}

.qu-content textarea {
  margin: 1rem 0 0 -20rem;
  resize: none;
}

textarea {
  font-family: monospace;
  border-color: rgb(169, 169, 169);
}

.qu-wrap > footer {
  display: flex;
  padding: 2rem 8rem;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

#backBtn,
#submitBtn {
  width: 8rem;
  height: 3rem;
  margin: 0 auto;
  line-height: 3rem;
  text-align: center;
  cursor: pointer;
  color: #fff;
  border: 1px solid #c26206;
  border-radius: 5px;
  background-color: #f07600;
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

