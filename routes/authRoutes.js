const express=require('express')
const router=express.Router()

const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const userSchema = require('../model/userSchema')

const verifyToken=require('../middlewares/verifyToken')
const authorizedRole=require('../middlewares/authorizedRoles')
const {login} =require('../controllers/authControllers')


// router.get('/',(req,res)=>{
//     res.status(200).json({
//         message:"API is working",
//         success:true
//     })
// })


router.post('/login',)



module.exports=router