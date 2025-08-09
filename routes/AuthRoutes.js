import { register, login, Logout, getUserData} from "../controller/Auth.js";
import express from "express";
const AuthRoutes = express.Router();

//user registration route
AuthRoutes.post("/register",register);
AuthRoutes.post("/login",login )
AuthRoutes.get("/logout",Logout)
AuthRoutes.get("/getUserData/:id", getUserData)



export default AuthRoutes;