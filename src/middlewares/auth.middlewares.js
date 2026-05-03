import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config()

const isAuthenticated = async (req,res,next)=>{
    try{
        let token;
        try{
            token = req.headers.authorization.split(' ')[1];
        }catch(error){
            return res.status(401).json({ message: 'No token provided' })
        }
        let decoded;
        try{
            decoded =  jwt.verify(token,process.env.JWT_SECRET_KEY)
        }catch(error){
            return res.status(401).json({ message: 'Invalid token' })
        }

        if(decoded){
            let user = await User.findById(decoded.id)
            if(!user){
                throw new Error("unknown user")
            }
            req.user = user
         //   console.log(req.user)   //the current user
        }
       
        next();

    }catch(error){
        next(error)
    }
}


export default isAuthenticated;