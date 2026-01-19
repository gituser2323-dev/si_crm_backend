const express=require('express')
const router=express.Router()

const userSchema=require('../model/userSchema')
const enquirySchema=require('../model/enquirySchema')
const additionalInfo=require('../model/additionalInfoschema')
const bcrypt=require('bcryptjs')

const verifyToken=require('../middlewares/verifyToken')
const authorizedRole=require('../middlewares/authorizedRoles')


router.post('/createadmin',async(req,res)=>{
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
})




router.get('/getusers',async(req,res)=>{
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
})


//dashboard
router.get('/dashboard',verifyToken,authorizedRole("admin"),(req,res)=>{
    try{
        return res.status(200).json({
            message:"Welcome To Dashboard",
            sucess:true,
            user:req.user
        })

    }catch(err)
    {
        return res.status(500).json({
            message:'Internal Server Error',
            success:false

        })
    }
})


// post enquiries
router.post('/enquiry',async(req,res)=>{
    try{

        const{name,email,phone,course}=req.body
        const leadExists=await enquirySchema.findOne({email})

        if(leadExists)
        {
            return res.status(409).json({
                message:"Lead Already Exists",
                sucess:false
            })
        }
        

        const response=await enquirySchema.create({
            name:name,
            email:email,
            phone:phone,
            course:course
        })


        return res.status(201).json({
            message:"Lead sent successfully",
            succcess:true,
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
})


// fetch enquries
router.get('/enquiry',verifyToken,authorizedRole("admin"),async(req,res)=>{

    try{
        const response=await enquirySchema.find().sort({ createdAt: -1 }); // latest first

        if(!response.length)
        {
            return res.status(200).json({
                message:"No Enquiries Found",
                success:true,
                data: []

            })
        }
        return res.status(200).json({
            message:"Eqnuiry Fetch Successfully",
            success:true,
            data:response,
            count: res.length,

        })


    }catch(err)
    { return res.status(500).json({
            message:"Internal Server error",
            success:false,
            err:err.message
        })}
    


})


// delete enquiry
router.delete('/enquiry/:id',verifyToken,authorizedRole("admin"),async(req,res)=>{

    try{
        const id=req.params.id;
        const response=await enquirySchema.findByIdAndDelete(id)

        if(!response)
        {
            return res.status(404).json({
                message:"No Enquiry Found",
                success:false,

            })
        }


     // 2️⃣ Delete all AdditionalInfo linked to this Enquiry
     await additionalInfo.deleteMany({ enquireId: id });

        return res.status(200).json({
            message:"Eqnuiry Deleted Successfully with Additional info",
            success:true,

        })


    }catch(err)
    { return res.status(500).json({
            message:"Internal Server error",
            success:false,
            err:err.message
        })}
    


})


router.get('/profile',verifyToken,authorizedRole("admin"),async(req,res)=>{
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
})



// 
router.get('/enquiry',verifyToken,authorizedRole("admin"),async(req,res)=>{

    try{
        const response=await enquirySchema.find().sort({ createdAt: -1 }); // latest first

        if(!response.length)
        {
            return res.status(200).json({
                message:"No Enquiries Found",
                success:true,
                data: []

            })
        }
        return res.status(200).json({
            message:"Eqnuiry Fetch Successfully",
            success:true,
            data:response,
            count: response.length,

        })


    }catch(err)
    { return res.status(500).json({
            message:"Internal Server error",
            success:false,
            err:err.message
        })}
    
})

//aditionalSchema

router.post('/additionalInfo',async(req,res)=>{

    try{

     const{enquireId,email,qualification,passoutYear,city,interestedCourse}=req.body

    if(!enquireId)
        {
        return res.status(400).json({
            success: false,
            message: "Enquiry ID is required",
      });
    }

    // prevent duplicate detailed info
     const alreadyExists = await additionalInfo.findOne({ enquireId });
       if (alreadyExists) {
       return res.status(409).json({
        success: false,
        message: "Additional info already submitted",
      });

        }
         if(!qualification || !city || !passoutYear)
        {
            return res.status(400).json({
                  message: "Qualification, Passout Year and City are required",
                  success:false
            })
        }

        const result=new additionalInfo({
            email:email,
            qualification:qualification,
            passoutYear:passoutYear,
            city:city,
            interestedCourse:interestedCourse,
            enquireId:enquireId,

        })


        await result.save()

        res.status(201).json({
                          success: true,
                          message: "Additional information saved successfully",
                          data: result,
                     });    

        
    }catch(err)
    {
    console.error("Save Additional Info Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      err:err.message
    });
    }


})


router.get('/additionalInfo',verifyToken,authorizedRole("admin"),async(req,res)=>{
    try{

        const result=await additionalInfo.find().sort({createdAt:-1}).populate('enquireId')

        return res.status(200).json({
            message:"Detailed Information fetched Successfully",
            success:true,
            data:result
        })

    }catch(err)
    {
     res.status(500).json({
      success: false,
      message: "Server error",
      err:err.message
    });
    }
})

module.exports=router