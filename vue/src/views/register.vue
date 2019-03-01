<template>
  <div class="login-wrap">
    <div class="ms-title">注册</div>
    <div class="ms-login">
      <el-form :model="form" :rules="rules" ref="form" label-width="0px" class="demo-ruleForm">
        <div v-if="errorInfo">
          <span>{{errInfo}}</span>
        </div>
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input type="text" v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" v-model="form.password"></el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item prop="newpassword">
          <el-input type="password" placeholder="确认密码" v-model="form.newpassword"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item prop="phone">
          <el-input type="phone" placeholder="手机号" v-model="form.phone"></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="verifycode">
          <el-input style="width:11.5rem" v-model="form.verifycode" placeholder="短信验证码"></el-input>
          <el-button
            :disabled="disabled"
            @click="getCode()"
            style="width:7rem;font-size:0.5rem"
          >{{btntxt}}</el-button>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item prop="email">
          <el-input type="email" placeholder="邮箱" v-model="form.email"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="register('form')">注册</el-button>
        </div>
        <p
          style="font-size:14px;line-height:30px;color:#999;cursor: pointer;float:right;"
          @click="goLogin()"
        >登录</p>
      </el-form>
    </div>
  </div>
</template>
 
 
<!--数据存贮交互，事件控制地区-->
<script>
import { setCookie, getCookie, delCookie } from "@/assets/js/cookie.js";
export default {
  name: "register",
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
    //确认密码
    var validateNewpassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else if (!(value === this.form.password)) {
        callback(new Error("两次密码不相同"));
      } else {
        callback();
      }
    };
    // 手机号验证
    var validatePhone = (rule, value, callback) => {
      var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!value) {
        return callback(new Error("请输入手机号码"));
      } else if (!phoneReg.test(value)) {
        callback(new Error("号码格式不正确"));
      } else {
        callback();
      }
    };
    var validateCode = (rule, value, callback) => {
      var verifycodeReg = /^\d{6}$/;
      if (!value) {
        return callback(new Error("请输入验证码"));
      } else if (!verifycodeReg.test(value)) {
        callback(new Error("验证码格式错误"));
      } else {
        callback();
      }
    };
    //邮箱验证
    var validateEmail = (rule, value, callback) => {
      var emailReg = /[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (!value) {
        return callback(new Error("请输入邮箱账号"));
      } else if (!emailReg.test(value)) {
        callback(new Error("邮箱地址不正确"));
      } else {
        callback();
      }
    };
    return {
      errorInfo: false,
      form: {
        username: "",
        password: "",
        newpassword: "",
        phone: "",
        email: "",
        verifycode: ""
      },
      disabled: false,
      time: 0,
      btntxt: "发送验证码",
      MSG: "",
      rules: {
        username: [
          { required: true, validator: validateUsername, trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: "blur" }
        ],
        newpassword: [
          { required: true, validator: validateNewpassword, trigger: "blur" }
        ],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        email: [{ required: true, validator: validateEmail, trigger: "blur" }],
        verifycode: [
          { required: true, validator: validateCode, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    /*提交进行判断的函数 */
    register(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$http
            .post("api/register", JSON.stringify(this.form))
            .then(function(res) {
              if(getCookie('code')){
                if (res.status == 200) {
                if (res.body.message == "用户名已存在") {
                  this.errorInfo = true;
                  this.errInfo = res.body.message;
                  this.form.username = "";
                } else if (res.body.message == "手机号已注册") {
                  this.errorInfo = true;
                  this.errInfo = res.body.message;
                  this.form.phone = "";
                } else if (res.body.message == "邮箱已注册") {
                  this.errorInfo = true;
                  this.errInfo = res.body.message;
                  this.form.email = "";
                } else if (res.body.message == "验证码错误") {
                  this.errorInfo = true;
                  this.errInfo = res.body.message;
                  this.form.verifycode = "";
                } else if (res.body.message == "注册成功") {
                  alert("注册成功");
                  this.$router.push("/login");
                }
              } else {
                console.log("error submit!!");
                return false;
              }
              }
              else{
                this.errorInfo = true;
                this.errInfo = "验证码已过期，请重新获取";
              }
            });
        }
      });
    },
    goLogin() {
      this.$router.push("/login");
    },
    getCode() {
      var phone = JSON.stringify(this.form.phone);
      if (this.form.phone == "") {
        alert("手机号不能为空");
        this.disabled = false;
        return;
      } else if (getCookie("code")) {
        this.errorInfo = true;
        this.errInfo = "验证请求过于频繁,3分钟内1次";
      } else {
        var code = parseInt(Math.random() * 900000 + 100000).toString();
        var all = "-" + phone + "|" + code;
        this.time = 60;
        this.disabled = true;
        this.timer();
        this.$http.get("api/sendMSG?all=" + all).then(res => {
          console.log(res);
          if (res.status == 200) {
            if (res.body.message == "发送成功") {
              alert("发送成功");
              setCookie("code", code, 1*60);
            } else if (res.body.message == "发送失败") {
              this.errorInfo = true;
              this.errInfo = "短信发送失败";
              delCookie("code");
            }
          } else {
            alert("网络错误");
          }
        });
      }
    },
    timer() {
      if (this.time > 0) {
        this.time--;
        this.btntxt = this.time + "s后重新获取";
        setTimeout(this.timer, 1000);
      } else {
        this.time = 0;
        this.btntxt = "获取验证码";
        this.disabled = false;
        this.errorInfo = false;
        this.errorInfo = "";
      }
    }
  }
};
</script>
 
<style scoped>
.login-wrap {
  margin: 200px auto;
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
  height: 440px;
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
