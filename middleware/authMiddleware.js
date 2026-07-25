import jwt from "jsonwebtoken"
import User from "../models/userSchema.js";

const authMiddleware = async (req , res ,next ) => {
    try{
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({message: "unauthorized access, no tken found "})
        }

        let decodedToken;
        try{
            decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        } catch(error) {    
            console.log(error)
            return res.status(401).json({message: "invalid token or token has expired"})
         }
         // updated the new unified User model and explicitly exclude the password field
        const user = await User.findById(decodedToken.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User account no longer exists"});
        }
        // Attached the user document to the request content
        req.user = user

        next();
    }catch (error) {
        console.error("Auth Middleware error:", error );
        return res.status(500).json({ message: " Server error during authentication"});

    } 
};

export default authMiddleware;