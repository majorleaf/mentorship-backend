import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDb from "./config/Mongodb.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import ProfileRoutes from "./routes/profileRoutes.js";

dotenv.config();

const app = express();


app.use(cors());
app.use(cookieParser());


app.use(express.json());

const allowOrigin =["https://mentorship-frontend-5vsz.vercel.app/","http://localhost:5173/"]
app.use(cors({       
    origin:"",
    Credentials:true,
    methods:["GET","PUT","DELETE","POST"],
    allowedHeaders:["context-type","Authorization"]
 }))
app.use("/api/auth",AuthRoutes);
app.use("/api/profile", ProfileRoutes)


app.get("/", (req, res)=>{
    res.json({message: " welcome to backend "})
})

connectDb();



app.listen(8000,()=> {
    console.log("server is running on http://localhost:8000");
});