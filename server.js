const express=require('express');
const app=express();
// cros跨域
app.all("*",function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();  
});
let mongoose=require('mongoose')
mongoose
  .connect("mongodb://localhost/user", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("连接数据库成功");
  })
  .catch((err) => {
    console.log(err);
  });
// 设定女生集合规则
const userSchema = new mongoose.Schema({
    username:String,
    password:String
});
// 创建集合
let user=mongoose.model('userInfor',userSchema);
let url=require('url');
let body_parser=require("body-parser")
app.use(body_parser.urlencoded({
    extended: false
}))
// 注册接口
app.get("/register",(req,res)=>{
    let obj=url.parse(req.url,true).query;
    user.find({username:obj.username}).then(data=>{
        if(data.length==0){
            user.create(obj).then(result=>{
                result?res.end('注册成功'):null;
            })
        }else{
            res.send({
                status:false,
                msg:'手机号已经注册过了，请您去登陆'
            })
        }
    })
})
// 登陆接口
app.post("/login",(req,res)=>{
    user.find({username:req.body.username,password:req.body.password}).then(data=>{
        // console.log(data)
        data.length==0?res.end("登陆失败"):res.end("登陆成功");
    })
})
app.listen('8080',()=>{
    console.log('8080 is runing');
})