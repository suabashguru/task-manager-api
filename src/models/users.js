const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
const { response } = require('express')
const jwt=require('jsonwebtoken')
const task=require('./task')
const UserSchema= new mongoose.Schema({

    name:{
        type:String,
        required: true,
        lowerCase:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowerCase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value))
                return new Error("invalid email")
        }
    },
    password:{
        type:String,
        trim:true,
        required:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password'))
             throw new Error("inproperite password,use proper one")
        }
        
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0)
                return new Error("invalid age")
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avator:{
        type:Buffer
    }
},
{
    timestamps:true
})

UserSchema.virtual('tasks',{
    ref:'task',
    localField:'_id',
    foreignField:'owner'

})

UserSchema.methods.toJSON= function(){
    const user=this
    const userobject=user.toObject()
    delete userobject.password
    delete  userobject.tokens
    delete  userobject.avator
    return userobject
}
UserSchema.methods.generatetoken=async function(){
    const user=this
    const token=jwt.sign({_id: user._id.toString()},process.env.JWT_API_KEY)
    user.tokens=user.tokens.concat({token})
    await user.save()
return token
}
UserSchema.statics.findByCredentials=async(email,password)=>{
    const user =await User.findOne({email})
    if(!user){
         throw  new Error("email login not found")
    }
    
    const ismatch =bcrypt.compare(password,user.password) 
    if(!ismatch){
        throw new Error('wrong password')
    }
    return  user 

}
UserSchema.pre('save',async function(next){
    const user =this
    if(user.isModified('password')){
       user.password= await bcrypt.hash(user.password,8)
    }
    next()
})

UserSchema.pre('remove',async function(next){
    const user =this
    await task.deleteMany({owner:user._id})
    next()
})
const User= mongoose.model('User',UserSchema)
module.exports = User;
