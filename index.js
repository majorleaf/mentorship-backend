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
//connecting to database
app.use("/api/auth",AuthRoutes);
app.use("/api/profile", ProfileRoutes)


app.get("/", (req, res)=>{
    res.json({message: " welcome to backend "})
})

connectDb();



app.listen(8000,()=> {
    console.log("server is running on http://localhost:8000");
});