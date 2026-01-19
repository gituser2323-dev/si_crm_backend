const jwt=require('jsonwebtoken')

const verifyToken=(req,res,next)=>{

    try{

        const authHeaders=req.headers.authorization
        if(!authHeaders)
        {
            return res.status(401).json({
                message:"No Authorization Header",
                success:false,
            })
        }

        const token=authHeaders.split(" ")[1];
        if(!token)
        {  return res.status(401).json({
                message:"Token is Missing",
                success:false
            })
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded; // { id, email, role, iat, exp }

        next()
        
    }catch(err)
    {

        return res.status(401).json({
            message:"Invalid or expired  token",
            success:false,
            err:err.message

        })
    }

}
module.exports=verifyToken