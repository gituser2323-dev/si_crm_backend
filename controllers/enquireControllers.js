const dashboard=(req,res)=>{
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
}


const postEnquiry=async(req,res)=>{
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
}

 const deleteEnquire=async(req,res)=>{

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
            message:"Enquiry Deleted Successfully",
            success:true,

        })


    }catch(err)
    { return res.status(500).json({
            message:"Internal Server error",
            success:false,
            err:err.message
        })}
    


}

const getEnquiries=async(req,res)=>{

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
    
}

const getAdditionalInfo=async(req,res)=>{

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


}

const getAdditionalInfoByEnquiryId=async (req, res) => {
    try {
      const { enquiryId } = req.params;

      const result = await additionalInfo
        .findOne({ enquireId: enquiryId })
        .populate("enquireId");

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Additional Info not found for this enquiry",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Additional Info fetched successfully",
        data: result,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    }
  }

  module.exports={dashboard,postEnquiry,deleteEnquire,getEnquiries,getAdditionalInfo,getAdditionalInfoByEnquiryId}
