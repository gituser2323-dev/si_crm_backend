const mongoose=require('mongoose')

const additionalInfo=new mongoose.Schema({

    enquireId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'enquire',
        required:true,
        unique:true
    },

    email:{
        type:String,
        trim:true,
        lowercase:true
    },
    qualification:{
        type:String,
        required:true,

    },
    passoutYear:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
        trim:true
    },
    interestedCourse:{
        type:[String],
        default:[]
    },
},
{
    timestamps:true
}
)

module.exports = mongoose.model("additionalInfo", additionalInfo);
