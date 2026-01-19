const mongoose=require('mongoose')

const enquirySchema=new mongoose.Schema({

    name:String,
    email:{
        type:String,
        required:true,
       },
    phone:String,
    course:String,

},

    {
     timestamps:true
    }
)



module.exports=mongoose.model("enquire",enquirySchema)