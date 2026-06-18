import jwt from "jsonwebtoken";

export const verifyTokenGaurd = async (req, res,next)=>{
    const authorization = req.headers['authorization'];
    if(!authorization)
        return res.status(400).send("Bad Request");
    const [type,token] = authorization.split(" ");   
    if(type !=="Bearer")
         return res.status(400).send("Bad Request");
    const payload = await jwt.verify(token,process.env.FORGOT_TOKEN_SECRET);
    req.user =  payload;
    next();
}
