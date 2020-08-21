const mongoose=require('mongoose')
const validator=require('validator');
const { schema } = require('./users');

const taskschema= new mongoose.Schema({
    des:{
        type:String,
        required:true,
        trim:true
    },
    available:{
        type:Boolean,
        required:true,
        trim:true
    },
    duty_time:
    {
        type:Number

    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
})
const task=mongoose.model('task',taskschema)

module.exports = task;