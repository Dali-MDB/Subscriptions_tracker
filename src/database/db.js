import mongoose from "mongoose";
import dotenv from "dotenv"



dotenv.config()

const DB_URL = process.env.DB_URL

if(!DB_URL){
    throw Error("the DB_URL is not configured in the .env file")
}

const connectDB = async ()=>{
    try{
        await mongoose.connect(DB_URL)
        console.log("the db connection has been made successfully")
    }catch(error){
        console.log(`an error occured when connecting to the database ${error.message}`)
        process.exit(1)
    }
}



export default connectDB;