import UserModel from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/mail.js";
import { otpTemplate } from "../utils/otp.template.js";
import { generateOTP } from "../utils/generate.otp.js";
import { forgotPasswordTemplate } from "../utils/forgot-template.js";
import http from "../../../frontend/src/utils/http.js";

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
        const {email}=req.body;
        const OTP=generateOTP();
        const isEmail= await UserModel.findOne({email});
        if(isEmail)
            return res.status(400).json({message:"Already Registered"});
        console.log("Sending OTP to:", email);
       await sendMail(email,"OTP for signup", otpTemplate(OTP)) 
        res.json({
            message:"Email Sent Successfully",
            otp : OTP,
            success : true
        });
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
           httpOnly :true,
           secure: process.env.ENVIRONMENT !=="DEV",
           sameSite: process.env.ENVIRONMENT === "DEV" ? "lax" : "none",
           path: "/",
           domain: undefined,
           maxAge:86400000,
        });
        res.json({message:"Login Success", role:user.role}); 
    }catch(err){
        res.status(500).json({message:err.message});
    }
}

export const forgotPassword = async (req,res)=>{
    try{
       const {email} = req.body;
       const user = await UserModel.findOne({email});
       if(!user)
            return res.status(404).json({message:"User doesn't exist."}) ;
        const token= await jwt.sign({id:user._id},process.env.FORGOT_TOKEN_SECRET,{expiresIn:"15m"});
        const link = `${process.env.DOMAIN}/forgot-password?token=${token}`;
        const sent= await sendMail(email,
            "Expense - Forgot Password ?", 
            forgotPasswordTemplate(user.fullname,link)
        );
        if(!sent)
            return res.status(424).json({message:'Email Sending Failed'});
        res.json({message:"Please check your email to change password"});
    }catch(err){
        res.status(500).json({message:err.message});
    }
}

export const verifyToken = async (req,res)=>{
    try{
      res.json("Verification Successful");
    }catch(err){
        res.status(500).json({message:err.message});
    }
}

export const changePassword = async (req,res)=>{
    try{
        const {password}= req.body;
        const encrypted= await bcrypt.hash(password.toString(),12);
        await UserModel.findByIdAndUpdate(req.user.id,{password: encrypted});
      res.json("Password Updated Successfully");
    }catch(err){
        res.status(500).json({message:err.message});
    }
}