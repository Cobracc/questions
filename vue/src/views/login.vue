<template>
  <div class="login-wrap">
    <div class="ms-title">登录</div>
    <div class="ms-login">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="0px"
        class="demo-ruleForm"
      >
        <div v-if="errorInfo">
          <span>{{errInfo}}</span>
        </div>
        <el-form-item prop="username">
          <el-input type="text" v-model="ruleForm.username" placeholder="账号" @focus="yanzheng()"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="ruleForm.password"
            @focus="yanzheng()"
          ></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
        <p
          style="font-size:14px;line-height:30px;color:#999;cursor: pointer;float:left;"
          @click="goForget()"
        >忘记密码</p>
        <p
          style="font-size:14px;line-height:30px;color:#999;cursor: pointer;float:right;"
          @click="goRegister()"
        >注册</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import { setCookie, getCookie } from "@/assets/js/cookie.js";
export default {
  name: "login",
  data() {
    //  用户名验证
    var validateUsername = (rule, value, callback) => {
      var usernameReg = /[a-zA-Z0-9\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]{2,11}/;
      if (!value) {
        return callback(new Error("请输入用户名"));
      } else if (!usernameReg.test(value)) {
        callback(new Error("用户名格式错误"));
      } else {
        callback();
      }
    };
    // 密码验证
    var validatePassword = (rule, value, callback) => {
      var passwordReg = /^(\w|[a-zA-Z0-9_-]|[`~!@#$%^&*()_+<>?:{},.\/;']){4,17}$/;
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else if (!passwordReg.test(value)) {
        callback(new Error("密码格式不正确"));
      } else {
        callback();
      }
    };
    return {
      errorInfo: false,
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, validator: validateUsername, trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    /*页面挂载获取cookie，如果存在username的cookie，则跳转到主页，不需登录*/
    if (getCookie("username")) {
      this.$router.push("/index");
    }
  },
  methods: {
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.$http
            .post("api/usernameLogin", JSON.stringify(this.ruleForm))
            .then(res => {
              if (res.status == 200) {
                if (res.body.message == "用户名不存在") {
                  this.errorInfo = true;
                  this.errInfo = "用户名不存在";
                  this.ruleForm.username = "";
                  this.ruleForm.password = "";
                } else if (res.body.message == "密码错误") {
                  this.errorInfo = true;
                  this.errInfo = "密码错误";
                  this.ruleForm.password = "";
                } else if (res.body.message == "登录成功") {
                  setCookie("username", this.ruleForm.username, 1000 * 60);
                  alert("登录成功");
                  this.$router.push("/index");
                }
              } else {
                alert("网络错误");
              }
            });
        } else {
          return false;
        }
      });
    },
    goRegister() {
      this.$router.push("/register");
    },
    goForget() {
      this.$router.push("/forget");
    },
    yanzheng() {
      this.errorInfo = false;
    }
  }
};
</script>

<style scoped>
.login-wrap {
  margin: 300px auto;
  position: relative;
  width: 100%;
  height: 100%;

}
.ms-title {
  position: absolute;
  width: 100%;
  margin-top: -200px;
  text-align: center;
  font-size: 30px;
  color: #60bdfa;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 180px;
  margin: -150px 0 0 -190px;
  padding: 40px;
  border-radius: 5px;
  background: aliceblue;
}
.ms-login span {
  color: red;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
}
.code {
  width: 112px;
  height: 35px;
  border: 1px solid #ccc;
  float: right;
  border-radius: 2px;
}
.validate-code {
  width: 136px;
  float: left;
}
</style>
