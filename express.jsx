var express=require('express');
var fs=require('fs')
var users=require('./MOCK_DATA.json');

var app=express();
app.use(express.urlencoded({extended:false}))
// middlewares
app.use((req,res,next)=>{
    console.log("middleware 1");
    req.name="name from middleware 1"
    next();

})

// app.use((req,res,next)=>{
//     console.log("middleware 1 "+req.name);
//     next();
// })

app.get('/',(req,res)=>{
    return res.end("hello express");
})

app.get('/user',(req,res)=>{
   // return res.json(user);
   var html=`
   <ul>
   ${users.map(x=>{return `<li>${x.first_name}</li>`}).join("")}
   </ul>
   `
   return res.send(html);
})
app.post("/user/:id",(req,res)=>{
    const body=req.body;
    users.push({
        id:users.length+1,
        first_name:body.first_name,
        last_name:body.last_name,
        email:body.email,
        gender:body.gender
    });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err,data)=>{
        return res.json({status:"pending"});
    })
    
})
app.patch("/user/:id",(req,res)=>{
    let id=Number(req.params.id);
    const {first_name,last_name,email,gender}=req.body;
    let userIndex=users.findIndex((user)=>user.id===id)

    if(first_name) users[userIndex].first_name=first_name;
    if(last_name) users[userIndex].last_name=last_name;
    if(email) users[userIndex].email=email;
    if(gender) users[userIndex].gender=gender;

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err,data)=>{
        return res.json({status:"pending"});
    })
})

app.delete('/user/:id',(req,res)=>{
    let id=Number(req.params.id);
    //const {first_name,last_name,email,gender}=req.body;
    let userIndex=users.findIndex((user)=>user.id===id)
    users.splice(userIndex,1);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err,data)=>{
        return res.json({status:"pending"});
    })
})
app.listen((8080),()=>{
    console.log("server running");
    
})