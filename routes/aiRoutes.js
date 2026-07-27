import express from "express";
import { chatWithMentor } from "../controller/aiController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All AI routes require the user to be logged in
router.post("/chat", authMiddleware, chatWithMentor);

export default router;