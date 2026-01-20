
const userSchema=require('../model/userSchema')
const enquirySchema=require('../model/enquirySchema')
const additionalInfo=require('../model/additionalInfoschema')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')


const login=async(req,res)=>{
    try{
        const{email,password}=req.body

        // const isUserExists=await userSchema.findOne({email:email})
        const isUserExists = await userSchema.findOne({ email }).select('+password');

        if(!isUserExists)
        {
            return res.status(403).json({
                message:"User Not Found",
                success:true,
             
            })
        }

        const isPasswordMatch=await bcrypt.compare(password,isUserExists.password)
        if(!isPasswordMatch)
        {
              return res.status(403).json({
                message:"Invalid Credentials",
                success:true,
             
            })
        }

        if(isUserExists && isPasswordMatch)
        {

            const token=jwt.sign({id:isUserExists._id, email:isUserExists.email,role:isUserExists.role},process.env.JWT_SECRET,{expiresIn:'1h'})

              return res.status(200).json({
                message:"Admin Login Sucessfully...",
                success:true,
                token:token,
                user: {
                        id:isUserExists._id,
                        email:isUserExists.email,
                        role:isUserExists.role,
                     },
            })
        }


    }catch(err)
    {
     return res.status(500).json({
        message:"Internal Server error",
        success:false,
        err:err.message
     })

    }
}

module.exports={login}