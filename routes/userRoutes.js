const express=require('express')
const router=express.Router()

const userSchema=require('../model/userSchema')
const enquirySchema=require('../model/enquirySchema')
const additionalInfo=require('../model/additionalInfoschema')
const bcrypt=require('bcryptjs')

const verifyToken=require('../middlewares/verifyToken')
const authorizedRole=require('../middlewares/authorizedRoles')

const { createAdmin ,getUsers,getProfile} =require("../controllers/adminControllers");
const {dashboard,postEnquiry,deleteEnquire,getEnquiries,getAdditionalInfo,getAdditionalInfoByEnquiryId} =require('../controllers/enquireControllers')



router.post('/createadmin',createAdmin)
router.get('/getusers',getUsers)
router.get('/profile',verifyToken,authorizedRole("admin"),getProfile)



//dashboard
router.get('/dashboard',verifyToken,authorizedRole("admin"),dashboard)


// post enquiries
router.post('/enquiry',postEnquiry)



// delete enquiry
router.delete('/enquiry/:id',verifyToken,authorizedRole("admin"),deleteEnquire)



// 
router.get('/enquiry',verifyToken,authorizedRole("admin"),getEnquiries)

//aditionalSchema

router.post('/additionalInfo',getAdditionalInfo)


router.get(
  "/additionalInfo/:enquiryId",
  verifyToken,
  authorizedRole("admin"),
  getAdditionalInfoByEnquiryId
);


module.exports=router