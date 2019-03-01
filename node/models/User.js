var mongoose = require('mongoose')

//设置字段
var UserSchema = new mongoose.Schema({
    userid: Number,
    username: String,
    password: String,
    email: String,
    phone: Number
});
UserSchema.statics.insertUser = function (json, callback) {
    var user = new User(json);
    user.save(function (err) {
        if (err) {
            callback(-2);  //服务器错误
            return;
        }
        //发回1这个状态
        callback(1);
    });
}

module.exports = mongoose.model('User', UserSchema)