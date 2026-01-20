export const createAdmin=async(req,res)=>{
    try{

        const{name,email,password}=req.body
        const hashpassword=await bcrypt.hash(password,10)

        // check userExists
        const isUserExists=await userSchema.findOne({email:email})

        if(isUserExists)
        {
            return res.status(200).json({
                message:"User ( Admin ) Already Exists",
                success:true
            })
        }

        const response=userSchema.create({
            name:name,
            email:email,
            password:hashpassword,
        })


        return res.status(200).json({
            message:"Admin Created Sucessfully",
            success:true,
            data:response
        })



    }catch(err)
    {

        return res.status(500).json({
            message:"Internal Server error",
            success:false,
            err:err.message
        })

    }
}


export const getUsers=async(req,res)=>{
    try{

        const response=await userSchema.find()
         return res.status(200).json({
            message:"Admin Created Sucessfully",
            success:true,
            data:response
        })
        
    }catch(err)
    {
        return res.status(500).json({
            message:"Internal Server error",
            success:false,
            err:err.message
        })

        
    }
}

export const getProfile=async(req,res)=>{
    try{
        // id comes from JWT
        const id=req.user.id

        const response=await userSchema.findById(id).select('-password'); // 🔒 hide password


        if(!response)
        {
            return res.status(404).json({
                message:"User Not Found",
                success:false
            })
        }

        return res.status(200).json({
            message:"User",
            success:true,
            user:response
        })

    }catch(err)
    {
        return res.status(500).json({
            message:"Internal Server error",
            success:false,
            err:err.message
        })

    }
}