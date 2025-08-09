import expresss from "express";
import { getUserData, EditProfile } from "../controller/profile.js";import authMiddleware from "../middleware/authMiddleware.js";

const ProfileRoutes =  expresss.Router()

ProfileRoutes.get("/getUserData/:id", getUserData);
ProfileRoutes.put("/editProfile/:id", EditProfile);

export default ProfileRoutes