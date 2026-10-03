import jwt from "jsonwebtoken";

export const verifyTokenGuard = async (req, res,next)=>{
    const authorization = req.headers['authorization'];
    if(!authorization)
        return res.status(400).send("Bad Request");
    const [type,token] = authorization.split(" ");   
    if(type !=="Bearer")
         return res.status(400).send("Bad Request");
    try {
    const payload = jwt.verify(token, process.env.FORGOT_TOKEN_SECRET);
    req.user = payload;
    next();
} catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
}
}


const invalid = async (res)=>{
    res.cookie('authToken',null,{
        httpOnly : true,
        secure : process.env.ENVIRONMENT !=="DEV",
        sameSite : process.env.ENVIRONMENT === "DEV" ? "lax" :"none",
        path : "/",
        domain : undefined,
        maxAge : 0,
    })
    res.status(400).json({message   : "Bad Request"});
}


export const AdminUserGuard = async (req, res, next) => {
    try {
        const { authToken } = req.cookies;
        if (!authToken)
            return invalid(res);
        const payload = jwt.verify(authToken, process.env.AUTH_SECRET);
        if (payload.role !== "user" && payload.role !== "admin")
            return invalid(res);
        req.user = payload;
        next();
    } catch (err) {
        return invalid(res);
    }
};

export const AdminGuard = async (req, res, next) => {
    try {
        const { authToken } = req.cookies;
        if (!authToken)
            return invalid(res);
        const payload = jwt.verify(authToken, process.env.AUTH_SECRET);
        if (payload.role !== "admin")
            return invalid(res);
        req.user = payload;
        next();
    } catch (err) {
        return invalid(res);
    }
};
