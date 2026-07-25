import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDb from "./config/Mongodb.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import aiRoutes from "./routes/aiRoutes.js"
import ProfileRoutes from "./routes/profileRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";

dotenv.config();

const app = express();

app.use(cors({       
  origin: [
    "https://mentorship-frontend-5vsz.vercel.app",
    "https://mentorship-frontend-ho2c.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "PUT", "DELETE", "POST"],
  allowedHeaders: ["content-type", "Authorization"]
}))

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", AuthRoutes);
app.use("/api/profile", ProfileRoutes);
app.use("/api/", mentorRoutes);
app.use("/api", aiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "welcome to backend" })
})

connectDb();

app.listen(8000, () => {
  console.log("server is running on http://localhost:8000");
});