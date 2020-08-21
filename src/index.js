const express=require('express');
require('./db/mongoose');
const UserRouter=require('./routers/user')
const TaskRouter=require('./routers/task')
const app=express()

const port=process.env.PORT
app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)
app.get('',(req,res)=>{
    res.send("new taskmanager appllication")
})

app.listen(port,()=>{
    console.log("listening on port "+ port)
});

// const jwt=require('jsonwebtoken');

// const myfunv=function(){

// const tokens= jwt.sign({_id:'ram123'} ,'hithere',{expiresIn:'1 second'})
// console.log(tokens)
// const verfy=jwt.verify(tokens,'hithere')
// console.log(verfy)
// }
// myfunv()