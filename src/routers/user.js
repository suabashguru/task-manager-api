const express=require('express')
const User=require('../models/users')
const auth =require('../middleware/auth')
const Router= new express.Router()
const multer=require('multer')
const { getRounds } = require('bcrypt')
const {sendwelcomemail,sendcancelmail}=require('../email/account')
Router.get('/users/me',auth,(req,res)=>{
    res.send(req.user)
})
Router.post('/users',async (req,res)=>{
    const user=new User(req.body)
    try{

        await user.save()
        await sendwelcomemail(user.email,user.name)
        const token= await user.generatetoken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(404).send("error")
    }
    
//     user.save().then(()=>{
//         res.send(user)
//    }).catch((e)=>{
//     res.status(400).send(e)
//    })

})
Router.post('/users/login',async(req,res)=>{
    
    try{
    const user = await User.findByCredentials(req.body.email,req.body.password)
    if(!user){
        return res.send('no id found')
    }
    const token= await user.generatetoken()
    res.send({user,token})
}catch(e){
    res.send(e)
}
})
Router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
        return token.token !== req.token
     })
     await req.user.save()
     res.send()
    }
    catch(e)
    {
        res.status(500).send()
    }
})
Router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
    req.user.tokens=[]
    await req.user.save()
    res.status(200).send()
    }catch(e){
        res.status(500).send()
    }
})
Router.get('/users/find',auth,async(req,res)=>{
  try { 
      const user= await User.find({})
      res.status(200).send(user)
    } 
catch(e){
    res.status(404).send(e)
}
// User.find({}).then((users)=>{
//         res.send(users)
//     }).catch((e)=>{
//         res.status(500).send()
//     })
})
Router.patch('/users/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedupdates=["age","name","email","password"]
    const vadlid=updates.every((e)=>allowedupdates.includes(e))
    
    if(!vadlid){
        return res.send({"error":"invalid error"})
    }
    try{
        updates.forEach((update)=>req.user[update]=req.body[update])
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.send(e)
    }
})
Router.delete('/users/delete/me',auth,async(req,res)=>{
   try{ 
    await req.user.remove()
     await sendcancelmail(req.user.email,req.user.name)
    res.status(200).send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpge|png)$/)){
           return cb(new Error ('upload a image file'))
        }
        cb(undefined,true)
    }

})
Router.post('/users/me/avator',auth,upload.single('avator'),async(req,res)=>{
    // const buffer=await sharp(req.file.buffer).resize({height:250,width:250}).png().toBuffer()
    req.user.avator=req.file.buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(404).send({error:error.message})
})
Router.delete('/users/me/avator',auth,async(req,res)=>{
    req.user.avator=undefined
    await req.user.save()
    res.send()
}) 
Router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user= await User.findById(req.params.id)
        if(!user || !user.avator){
            throw new Error()
        }
        res.set('content-Type','image/jpg')
        res.send(user.avator)
    }catch(e){
        res.status(404).send("error")
    }
})
module.exports=Router