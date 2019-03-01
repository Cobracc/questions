const express = require('express')
const router = require('./router')
var app = express()

var bodyParser = require('body-parser')
var expressSession = require('express-session');


var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/wenjuan',{ useNewUrlParser: true });
mongoose.connection.on('connected', function () {
    console.log('连接成功');
});
mongoose.connection.on('error', function (err) {
    console.log('连接异常');
});
mongoose.connection.on('disconnected', function () {
    console.log('连接断开');
});


app.use(expressSession({
    name: "mazg",
    secret: 'secret', // 对session id 相关的cookie 进行签名
    resave: false,
    rolling: true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie: {
        maxAge: 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
    },
}));

//配置跨域请求
app.all('/api/*', (req, res, next) => {
    //设置允许跨域响应报文头
    //设置跨域
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Content-Length, Authorization, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    next();
});

//配置bodyParser用于解析post请求，配置一定要在挂载路由之前
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/api", router)

app.listen(8080, function () {
    console.log('app is running at port 8080.')
})