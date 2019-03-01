<template>
    <div class="container">
     <headercc></headercc>
    <div class="qu-wrap">
      <header>
        <router-link tag="span" to="/">&lt; 返回</router-link>
        <p>{{ quData.title }}</p>
      </header>
      <div class="qu-content">
        <div class="qu-item" v-for="(item, index) in quData.questionss">
          <section class="qu-data">
            <h3>{{ `Q${index + 1}&nbsp;&nbsp;&nbsp;${item.topic}`}}</h3>
            <template v-if="item.type !== 'textarea'">
              <p v-for="option in item.options">{{ option }}</p>
            </template>
            <p v-else>有效回答</p>
          </section>
          <section class="ans-data">
            <h4>数据占比</h4>
            <template v-if="item.type === 'radio'">
              <p class="outerBar" v-for="(option, optIndex) in item.options">
                <span class="innerBar" :style="{width: randomScale()}"></span>
                <span class="scaleNum"></span>
              </p>
            </template>
            <p class="outerBar" v-else-if="item.type === 'textarea'">
              <span class="innerBar" :style="{width: randomScale()}"></span>
              <span class="scaleNum"></span>
            </p>
			     <template v-if="item.type ==='checkbox' ">
              <p class="outerBar" v-for="(option, optIndex) in item.options">
                <span class="innerBar" :style="{width: randomScale()}"></span>
                <span class="scaleNum"></span>
              </p>
            </template>
          </section>
        </div>
      </div>
      <footer>
        <router-link tag="p" to="/" id="backBtn">返 回</router-link>
      </footer>
    </div>
	
  </div> 
</template>

<script>
import headercc from "@/components/header.vue";
export default {
  name: "Data",
  data() {
    return {
      quData: {},
      scale: ""
    };
  },
  components: {
    headercc
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
        this.quData = res.body.data[0];
        //this.questions = this.quData[0].questionss;
        // this.questions.forEach(item => {
        //   if (item.type === "checkbox") {
        //     item.answer = [];
        //   } else {
        //     item.answer = "";
        //   }
        // });
      });
    },

    randomScale() {
      return Math.random().toFixed(2) * 100 + "%";
    },

    renderEchart() {
	  let myChart = this.$echarts.init(document.getElementById('echart'));
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "选择人数",
            type: "pie",
            radius: "60%",
            center: ["30%", "50%"],
            data: [
              { value: 20, name: "选项1" },
              { value: 30, name: "选项2" },
              { value: 40, name: "选项3" },
              { value: 50, name: "选项4" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
      
    }
  },

  mounted() {	  
    this.renderEchart();
    // let charts = document.querySelectorAll('.echart');
		// [].forEach.call(charts, (item) => {
		// 	this.renderEchart(item);
		// });
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
    box-sizing: border-box;
    padding: 2rem;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 0 5px #ccc;
}

.qu-wrap > header {
  position: relative;
  height: 4rem;
  margin: 0 2rem 2rem;
  line-height: 4rem;
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
  width: 40rem;
  margin: 0 auto;
  font-size: 1.5rem;
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

.qu-content .qu-item {
    display: -ms-flexbox;
    display: flex;
    border: 2px solid #ccc;
}

.qu-content .qu-item {
    position: relative;
    /* margin: -15rem 0; */
    /* padding: 15rem 2rem; */
	padding-top: 15rem;
}

.qu-content .qu-item .qu-data {
    -ms-flex: 3;
    flex: 3;
	text-align: left;
	margin-top: -12rem;
}

.qu-content .qu-item .ans-data, .qu-content .qu-item .qu-data {
    height: 2rem;
}

.qu-content .qu-item .qu-data p {
    margin: 1rem 0 0 3rem;
}

.qu-content .qu-item .ans-data{
    -ms-flex: 2;
    flex: 2;
	margin-top: -14rem;
}

.qu-content .qu-item .ans-data, .qu-content .qu-item .qu-data {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
}

h1, h2, h3, h4, h5, h6 {
    font-size: 100%;
    font-weight: 400;
}

.qu-content .qu-item .ans-data .outerBar {
    position: relative;
    width: 20rem;
    height: 1.2rem;
    margin: 1.6rem 0 0;
    font-size: 1.2rem;
    border: 1px solid #ccc;
}

.qu-content .qu-item .ans-data .innerBar {
    display: block;
    width: 60%;
    height: 100%;
    background-color: #f07600;
}

.qu-content .qu-item .ans-data .scaleNum {
    position: absolute;
    top: 0;
    right: -4rem;
}

.qu-content .options-list > li {
  height: 1.5rem;
  font-size: 1rem;
  line-height: 1.5rem;
  text-align: left;
  margin-left: 4rem;
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

.qu-wrap > footer {
  display: flex;
  padding: 2rem 8rem;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
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
  border: 1px solid #60bdfa;
  border-radius: 5px;
  background-color: #60bdfa;
}


.qu-content .qu-item .ans-data .echart, .qu-content .qu-item .qu-data .echart {
    height: 400rem;
}
</style>
