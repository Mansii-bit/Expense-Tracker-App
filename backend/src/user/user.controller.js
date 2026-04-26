import UserModel from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/mail.js";

export const createUser = async (req,res)=>{
    try{
        const data=req.body;
        const user=new UserModel(data);
        await user.save();
        res.json(user);
    }catch(err){
        res.status(500).json({message:err.message});
    }
}

export const sendEmail = async (req,res)=>{
    try{
       await sendMail("mansi.knp19@gmail.com","OTP for signup", "<h1>123456</h1>") 
        res.json({message:"Email Send Successfully"});
    }catch(err){
        res.status(500).json({message:err.message});
    }
}



const createToken = async (user)=>{
    const payload={
        id:user._id,
        fullname:user.fullname,
        email:user.email,
        role:user.role
    }
    const token= await jwt.sign(payload,process.env.AUTH_SECRET,{expiresIn:"1d"});
    return token;
}
export const login = async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await UserModel.findOne({email});
        if(!user)
            return res.status(404).json({message:"User not Found"}); //404-not found
        const isLogged=await bcrypt.compare(password,user.password);
        if(!isLogged)
            return res.status(401).json({message:"Incorrect Password"});//401-unauthorized
        
        const token= await createToken(user);
        res.cookie("authToken",token,{
            maxAge:86400000,
            domain: process.env.ENVIRONMENT === "DEV" ? "localhost" :process.env.DOMAIN,
            secure: process.env.ENVIRONMENT === "DEV" ? false : true,
            httpOnly:true
        });
        res.json({message:"Login Success"}); 
    }catch(err){
        res.status(500).json({message:err.message});
    }
}