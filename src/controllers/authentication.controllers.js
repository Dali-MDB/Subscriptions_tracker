import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv"


dotenv.config()

const generate_token = (email,user_id)=>{

    const data = {
        'id':user_id,
        'email' : email,
    }
    const access_token = jwt.sign(data,process.env.JWT_SECRET_KEY, { expiresIn: `${process.env.JWT_EXP_ACCESS}m` })
    const refresh_token = jwt.sign(data,process.env.JWT_SECRET_KEY, { expiresIn: `${process.env.JWT_EXP_REFRESH}d` })
    console.log(refresh_token,access_token)
    return [refresh_token,access_token]
}

const authenticate = async (email,password)=>{
    try{
    //we search the user
    let user = await User.findOne({'email':email}).select('+password')   //include the password
    if (!user)   
        return false;

    if(! await bcrypt.compare(password,user.password))
        return false;
    return user;   //valid credentials
    }catch(error){
        console.log(`an error occured when authenticating the user ${error.message}`)
        return false;
    }

}
  
export async function Register(req, res, next){
    try{
    let {name,email,password} = req.body;

    let user = await User.findOne({'email':email})
    if (user){
        const err = new Error("a user with this email is already registered")
        err.status_code = 409;
        throw err
    }
    //we hash the password
    password = await bcrypt.hash(password,10);

    //we create the user
    user = User.create({
        'email': email,
        'name' : name,
        'password' : password,
    })

    //we generate the tokens for the user
    const [refresh_token,access_token]= generate_token(user.email,user.id)

    return res.status(201).json({
        'success':true,
        'message':"the user has been created successfully",
        "data" : {
            'refresh_token':refresh_token,
            'access_token':access_token
        }
    })
    }catch(error){
        console.log(`an error occured when registering the user ${error.message}`)
        return res.status(500).json({
            'success':false,
            'message':'an error occured when registering the user'
        })
    }
}




export async function Login(req,res,next) {
    try{
    let {email,password} = req.body;

    //we authenticate the user
    let user = await authenticate(email,password)
    if (!user){
        return res.status(401).json({
            'success':false,
            'message':'invalid credentials'
        })
    }
    //we generate refresh and access tokens
    const [refresh_token,access_token]= generate_token(user.email,user.id)

    return res.status(201).json({
        'success':true,
        'message':"login was a success",
        "data" : {
            'refresh_token':refresh_token,
            'access_token':access_token
        }
    })
    }catch(error){
        console.log(`an error occured when logging in the user ${error.message}`)
        return res.status(500).json({
            'success':false,
            'message':'an error occured when logging in the user'
        })
    }
}