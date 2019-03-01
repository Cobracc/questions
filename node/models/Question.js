var mongoose = require('mongoose')

//设置字段
var QuestionSchema = new mongoose.Schema({
    userid: Number,
    username: String,
    title:String,
    state:Number,
    stateName:String,
    time:String,
    questionss:Array
});
QuestionSchema.statics.insertUser = function (json, callback) {
    var question = new Question(json);
    question.save(function (err) {
        if (err) {
            callback(-2);  //服务器错误
            return;
        }
        //发回1这个状态
        callback(1);
    });
}

module.exports = mongoose.model('Question', QuestionSchema)