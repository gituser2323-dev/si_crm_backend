const express=require('express')
const app=express()


app.use(express.static('public/'));
app.use(express.urlencoded({extended:true}));
app.use(express.json())

const userRoutes=require('../routes/userRoutes')
const authRoutes=require('../routes/authRoutes')

const dotenv=require('dotenv')
dotenv.config()

const connection=require('../config/db')
connection()

const cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://si-crm-ebon.vercel.app",
  "https://www.speedupinfotech.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // ✅ allow Postman
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ✅ Preflight
app.options("*", cors());


app.get('/api',(req,res)=>{
    res.status(200).json({
        message:"Server Is up...",
        success:true
    })
})

app.use('/api/auth',authRoutes)
app.use('/api',userRoutes)




const PORT=process.env.PORT || 3000
const HOST='127.0.0.1'
// app.listen(PORT,HOST,()=>{
//     console.log(`Server Is up... on http://${HOST}:${PORT}`)
// })
module.exports = app;
