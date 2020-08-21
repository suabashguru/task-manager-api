const express=require('express')
const task=require('../models/task')
const Router= new express.Router()
const auth=require('../middleware/auth')
Router.get('/test',(req,res)=>{
    res.send("the test page")
})
Router.post('/task',auth,async(req,res)=>{

    // const task1=new task(req.body)
    const task1=new task({
        ...req.body,
        owner:req.user._id 
    })
    try{
        console.log(task1)
        await task1.save()
        res.status(201).send(task1)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
    // task1.save().then(()=>{
    //     res.status(201).send(task1)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})
Router.get('/task/find',auth,async(req,res)=>{
    const match={}
    if(req.query.available){
        match.available=req.query.available==="true"
    }
    const sort={}
    if(req.query.sortBy){
        const part= req.query.sortBy.split(':')
        sort[part[0]]=part[1]==='desc'?-1:1

    }

    try{
        // const finds=await task.find({})
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
            }).execPopulate()
        res.send(req.user.tasks)
      }catch(e){
        res.status(404).send(e)
      }
      
    // task.find({}).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.send(e)
    // })
})
Router.get('/task/find/:id',auth,async(req,res)=>{
    const _id=req.params.id
    try{
        const tasks= await task.findOne({ _id, owner: req.user._id})
        res.send(tasks)
      }catch(e){
        res.status(404).send(e)
      }
      


    // task.findById(id).then((task)=>{
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})


Router.patch('/task/update/:id',auth,async(req,res)=>{
    const updatedata=Object.keys(req. body)
    const allowed=("des","duty_time","available")
    const vadlid=updatedata.every((updatedata)=>allowed.includes(updatedata))
    
    if(!vadlid){
        return res.send("error")
    }
    const _id=req.params.id
    try{
    
        const user=await task.findOne({_id,owner:req.user._id})
       
        if(!user){
            return res.status(404).send()
        }
        updatedata.forEach((update)=>user[update]=req.body[update])
        await user.save()
        res.send(user)
    }catch(e){
        res.send(e)
    }
})
Router.delete('/task/delete/:id',auth,async(req,res)=>{
    try
    {
        // const del= await task.findByIdAndDelete(req.params.id)
        const de=await task.findOneAndDelete({_id:req.params.id, owner: req.user._id})
        res.send(del)
    }
    catch(e){
        res.status(404).send(e)
    }
})
module.exports=Router
