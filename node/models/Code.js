var mongoose = require('mongoose')

//设置字段
var CodeSchema = new mongoose.Schema({
    code: Number,
    phone:Number
});
CodeSchema.statics.insertCode = function (json, callback) {
    var code = new Code(json);
    code.save(function (err) {
        if (err) {
            callback(-2);  //服务器错误
            return;
        }
        //发回1这个状态
        callback(1);
    });
}

module.exports = mongoose.model('Code', CodeSchema)