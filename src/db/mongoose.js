const mongoose=require('mongoose')
const validator=require('validator')

mongoose.connect(process.env.MONGOOSE_LINK,{
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useNewUrlParser: true
})
// console.log(process.env.PORT)
// const first=new User(
//     {
//         name:"jon",
//         email:'subashguru2@gmail.com',
//         password:'popopoooo',
//         age:54
//     })
// first.save().then((result)=>{
//  console.log(result)
// }).catch((err)=>{console.log(err)})

// const firsttask=new task({name:'subash',available:'false',age:21})
// firsttask.save().then((result)=>{
//  console.log(result)
// }).catch((err)=>{console.log(err)})