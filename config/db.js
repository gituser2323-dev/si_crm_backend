const mongoose=require('mongoose')
const connection=async()=>{
    try{

        await mongoose.connect(process.env.MONGO_URL)
        console.log("DB Connection Done",mongoose.connection.readyState)

    }catch(err)
    {
        console.log("DB Connection Faild, ", mongoose.connection.readyState)
        console.error(err.message);
        process.exit(1); // stop app if DB fails


    }
}

module.exports=connection