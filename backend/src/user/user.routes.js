import{Router} from "express";
import {createUser , login, sendEmail, forgotPassword, verifyToken, changePassword,logout, getAllUsers,updateStatus} from "./user.controller.js";
import { AdminGuard, AdminUserGuard, verifyTokenGuard } from "../middleware/guard.middleware.js";

const userRouter = Router();

userRouter.post("/",createUser);
userRouter.post("/login",login);
userRouter.get("/logout",logout);

userRouter.get("/get",AdminGuard, getAllUsers);

userRouter.put("/status/:id",AdminGuard, updateStatus);

userRouter.post("/send-mail",sendEmail);
userRouter.post("/forgot-password",forgotPassword);
userRouter.get("/session",AdminUserGuard,(req,res)=>{
    return res.json(req.user);
});
userRouter.post("/verify-token",verifyTokenGuard,verifyToken);
userRouter.put("/change-password",verifyTokenGuard,changePassword);

export default userRouter;