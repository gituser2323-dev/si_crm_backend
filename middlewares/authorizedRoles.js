const authorizedRole=(...allowedRoles)=>{
    

    return (req,res,next)=>{

        if(!req.user || !allowedRoles.includes(req.user.role))
        {
            return res.status(403).json({
                message:{

                    message:"Access Denied",
                    success:false
                }
            })
        }

         next()
    }
       

}

module.exports=authorizedRole


