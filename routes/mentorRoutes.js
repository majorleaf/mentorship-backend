import express from "express";
import { addMentor, getMentor } from "../controller/mentorcontroller.js"; 

const mentorRoutes = express.Router();

mentorRoutes.post("/addMentor", addMentor);
mentorRoutes.get("/getMentors", getMentor);

export default mentorRoutes;
