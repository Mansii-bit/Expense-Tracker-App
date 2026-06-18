import{Router} from "express";
import {createUser , login, sendEmail, forgotPassword, verifyToken, changePassword} from "./user.controller.js";
import { verifyTokenGaurd } from "../middleware/gaurd.middleware.js";

const userRouter = Router();

userRouter.post("/signup",createUser);
userRouter.post("/login",login);
userRouter.post("/send-mail",sendEmail);
userRouter.post("/forgot-password",forgotPassword);
userRouter.post("/verify-token",verifyTokenGaurd,verifyToken);
userRouter.put("/change-password",verifyTokenGaurd,changePassword);

export default userRouter;