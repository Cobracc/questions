var express = require('express');
var router = express.Router();
var url = require("url");
var Users = require('./models/User');
var Codes = require('./models/Code');
var Question = require('./models/Question');
var md5 = require('md5');


// 用户注册
router.post('/register', function (req, res) {
    const newUser = new Users({ // 用户传参
        username: req.body.username,
        password: md5(md5(req.body.password)),
        phone: req.body.phone,
        email: req.body.email,
        // status: req.body.status
    });
    const code = req.body.verifycode;
    const phone = req.body.phone;
    const username = req.body.username;
    Codes.find({ code: code, phone: phone }, { code: 1, phone: 1 }, (err, data) => {
        if (data.length > 0) {
            Users.find({ username: username }, (err, data) => {
                if (data.length > 0) {
                    if (data[0].username == username) {
                        res.send({ isSuccess: false, message: '用户名已注册' })
                    }
                    else if (data[0].email == email) {
                        res.send({ isSuccess: false, message: '邮箱已注册' })
                    }
                    else if (data[0].phone == phone) {
                        res.send({ isSuccess: false, message: '手机号已注册' })
                    }

                } else { // 向logins集合中保存数据
                    newUser.save(err => {
                        const datas = err ? { isSuccess: false } : { isSuccess: true, message: '注册成功' }
                        res.send(datas);
                    });
                }
            })
        }
        else {
            res.send({ isSuccess: false, message: '验证码错误' })
        }
    }).sort({ _id: -1 }).limit(5)
});


// 账号登录
router.post('/usernameLogin', function (req, res) {
    const newUser = new Users({ // 用户传参
        username: req.body.username,
        password: req.body.password
        // status: req.body.status
    });
    const username = req.body.username;
    const password = md5(md5(req.body.password));
    Users.find({ username: username }, (err, data) => {
        if (data.length > 0) {
            if (data[0].password == password) {
                res.send({ isSuccess: true, message: '登录成功' })
            }
            else {
                res.send({ isSuccess: false, message: '密码错误' })
            }
        }
        else {
            res.send({ isSuccess: false, message: '用户名不存在' })
        }
    })
})


//手机登录
router.post('/phoneLogin', function (req, res) {
    const newUser = new Users({ // 用户传参
        phone: req.body.phone,
        // status: req.body.status
    });
    const phone = req.body.phone;
    Users.find({ phone: phone }, (err, data) => {
        if (data.length > 0) {
            res.send({ isSuccess: true, message: '登录成功' })
        }
        else {
            res.send({ isSuccess: false, message: '此手机号没注册' })
        }
    })
})


//发送短信
router.get('/sendMSG', function (req, res) {
    var phoneNumber1 = url.parse(req.url, true).query.all.split('-"')[1];
    var phoneNumber = phoneNumber1.split('"|')[0];
    //var code = parseInt(Math.random()*900000+100000).toString();
    var code = url.parse(req.url, true).query.all.split("|")[1];
    var QcloudSms = require("qcloudsms_js");
    // 短信应用SDK AppID
    var appid = 1400176892;  // SDK AppID是1400开头
    // 短信应用SDK AppKey
    var appkey = "31fbdcc46651bd3bf392ea691c71999d";
    // 需要发送短信的手机号码
    var phoneNumbers = phoneNumber;
    // 短信模板ID，需要在短信应用中申请
    var templateId = 263447;  // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请
    //templateId 7839 对应的内容是"您的验证码是: {1}"
    // 签名
    var smsSign = "CC问卷";  // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`
    // 实例化QcloudSms
    var qcloudsms = QcloudSms(appid, appkey);
    // 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
    function callback(err, data) {
        if (err) {
            res.send({ isSuccess: false, message: '发送失败' })
        } else {
            res.send({ isSuccess: true, message: '发送成功' });
            var yanzhengma = new Codes({ code: code, phone: phoneNumber });
            yanzhengma.save().then(() => console.log('保存完毕'));
        }
    }
    var ssender = qcloudsms.SmsSingleSender();
    var params = [code];
    ssender.sendWithParam(86, phoneNumbers, templateId,
        params, smsSign, "", "", callback);
})


//保存问卷
router.post("/savequestion", function (req, res) {
    var questionsdata = new Question({
        username: req.body.username,
        title: req.body.title,
        state: req.body.state,
        stateName: req.body.stateName,
        time: req.body.time,
        questionss: req.body.questions
    });
    questionsdata.save(err => {
        console.log("保存成功");
        const datas = err ? { isSuccess: false } : { isSuccess: true, message: '保存成功' }
        res.send(datas);
    });
})


//查询问卷
router.post("/findquestion", function (req, res) {
    const username = req.body.username;
    Question.find({ username: username }, (err, data) => {
        res.send({ data });
    })
});


//删除用户问卷
router.post("/deletequestion", function (req, res) {
    const _id = req.body.id;
    Question.deleteOne({ _id: _id }, (err, data) => {
        console.log(data.result);
        res.send({ message: "删除成功" });
    })
})


//删除选中用户问卷
router.post("/deletecheck", function (req, res) {
    const ids = [];
    for (var i = 0; i < req.body.checkList.length; i++) {
        ids[i] = req.body.checkList[i];
    }
    Question.deleteMany({$or:[
        { _id: ids[0]},{ _id: ids[1]},
        { _id: ids[2]},{ _id: ids[3]},
        { _id: ids[4]},{ _id: ids[5]},
        { _id: ids[6]},{ _id: ids[7]},
        { _id: ids[8]},{ _id: ids[9]},
        { _id: ids[10]},{ _id: ids[11]},
        { _id: ids[12]},{ _id: ids[13]},
        { _id: ids[14]},{ _id: ids[15]},
    ]}, (err, data) => {
        console.log(data.result);
        res.send({ message: "删除成功" });
    })
	console.log(ids);
	
    // ids.forEach(function(id){
	// 	(function(idForDel){
	// 		Question.find({_id : idForDel},function(err,data){
	// 			data[0].deleteMany(function(err){
	// 				if(err){
	// 					return;
    //                 }
    //                 res.send({ message: "删除成功" });
    //             });
                
    //         });
            
    //     })(id);
    // });
})   


//查看问卷
router.get("/findwenjuan", function (req, res) {
    var _id = url.parse(req.url, true).query.id;
    Question.find({ _id : _id }, (err, data) => {
        res.send({ data });
    })
});


//大厅展示问卷
router.post("/showwenjuan",function(req,res){
  const state = req.body.state;
  Question.find({ state : state }, (err, data) => {
      res.send({ data });
  })
});


//搜索
router.get("/search/:searchText",function(req,res){
var keyword = req.params.searchText;
	console.log("keyword"+keyword);
	str = new RegExp(keyword, "i"); //模糊查询的正则字段  忽略大小写
	Question.find({
		title: str
	}, function(err, data) {
		if(err) {
			console.log("查询出错");
			return;
		}
        console.log(data);
        res.send({data});
	});
})


//修改密码
router.post('/forget', function (req, res) {
    const password = md5(md5(req.body.password));
    const code = req.body.verifycode;
    const phone = req.body.phone;
    Codes.find({ code: code, phone: phone },{code:1,phone:1} ,(err, data) => {
        if (data.length > 0) {
            Users.find({ phone: phone }, (err, data) => {
                if (data.length > 0) {
                    Users.update({ password: password }, (err, data) => {
                        res.send({ isSuccess: false, message: '修改成功' })
                }) 
            }else { 
                res.send({ isSuccess: false, message: '手机号尚未注册' })
                }
            })
        }
        else {
            res.send({ isSuccess: false, message: '验证码错误' })
        }
    }).sort({ _id: -1 }).limit(5)
});


// router.get('/getproduct', function (req, res) {
//     //要获取get请求参数用req.query
//     //console.log(req.query.name);
//     res.send('this is product');
// });

// //用户登录之后，在node后台将用户信息保存到node服务器
// router.get("/setsession", function (req, res) {
//     req.session.userinfo = "zhangsan111";
//     res.send('setsession');
// })

// //用户登录之后下次再去访问node服务器的时候就可以获取node服务器中所保存的session的信息了
// router.get("/getsession", function (req, res) {
//     res.send(req.session.userinfo);
// })

// router.get("/getuser", function (req, res) {
//     /*user.find({age:23,sex:'男'},(err,users)=>{
//         console.log(users);
//          res.status(200).json(users)
//     })*/

//     /*user.
//     find({}).limit(5).
//     sort({ age: 1 }).
//     exec((err,users)=>{
//         console.log(users)
//         res.status(200).json(users)
//     });*/
// })     res.status(200).json(users)
//     })*/

//     /*user.find({age:23},(err,users)=>{
//         console.log(users);
//         res.status(200).json(users)
//     })*/

//     /*user.find({$or:[{age:23},{name:'史蒂文分为'}]},(err,users)=>{
//         console.log(users);
//   


// router.post("/adduser", function (req, res) {
//     let { name, sid, cid } = req.body
//     //插入数据
//     new user({
//         cid,
//         name,
//         sid
//     }).save((err, data) => {
//         res.send(data)
//     })
// })

// router.post("/updateuser", function (req, res) {
//     let { sid, name } = req.body
//     //更新数据
//     user.findOneAndUpdate({ sid: sid }, { name: name }, (err, data) => {
//         res.send(data)
//     })
// })

// router.get("/deleteuser/:id", function (req, res) {
//     let id = req.params.id
//     //更新数据
//     user.deleteOne({ _id: id }, (err, data) => {
//         res.send(data)
//     })
// })

// router.get("/insertClazz", (req, res) => {
//     new clazz({
//         cid: 1,
//         cname: 'java班'
//     }).save((err, data) => {
//         res.send(data)
//     })
// })

// router.get("/getuser2", (req, res) => {
//     //如果在mongoose里面要做关联查询，用populate字段
//     user.findOne({ sid: 100 }).populate('cid').exec((err, data) => {
//         console.log(data);
//         res.send(data);
//     })
// })

//导出router
module.exports = router;