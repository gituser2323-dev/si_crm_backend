const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:String,
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
        trim: true,
    },
    password:{
        type:String,
        select: false, // 🔒 hide password in queries when User.find() // password will NOT come

    },
    role: {
      type: String,
      enum: ['admin', 'manager'],
      default: 'admin',
    },
},
    {
     timestamps:true
    }
)
module.exports=mongoose.model("user",userSchema)