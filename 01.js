const express=require("express")
const app=express()
const url=require("url")
//跨域
app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
  });
  //操作数据库
  let mongoose=require("mongoose")
  mongoose.connect("mongodb://localhost/data",{
    useNewUrlParser: true,
    useUnifiedTopology: true  
  }).then(()=>{
      console.log("连接数据库成功")
  }).catch((arr)=>{
    console.log(arr)
  })
  //设置规则
  const tslSchema=new mongoose.Schema({
    username:String,
    age:Number,
    sex:String
  })
  //创建集合
  let tsl = mongoose.model("infor",tslSchema)
  //渲染接口
  app.post("/show",(req,res)=>{
    tsl.create(req.query).then(data=>{
      data?res.end("增加成功"):res.end("增加失败")
    })
  })
  //提交按钮
  app.get("/add",(req,res)=>{
    tsl.create(req.query).then(data=>{
      data?res.send({status:1,msg:"增加成功"}):res.send({status:0,msg:"增加失败"})
    })
  })
  //删除
  app.get("/del",(req,res)=>{
    tsl.findByIdAndDelete({_id:req.body._id}).then(data=>{
      data?res.send({status:1,msg:"删除成功"}):res.send({status:0,msg:"删除失败"})
    })
  })
  //修改
  app.get("/edit",(req,res)=>{
    tsl.find({_id:req.query.id}).then(data=>{
      res.send(data)
    })
    //确认修改
    app.get("/confirmedit",(req,res)=>{
      tsl.updateOne({_id:req.query.id},{age:req.query.age,sex:req.query.age}).then(data=>{
        data.ok==1?res.send({status:1,msg:"修改成功"}):res.send({status:1,msg:"修改失败"})
      })
    })
  })
  //设置监听
  app.listen("8000",()=>{
    console.log("8000 is runing")
  })