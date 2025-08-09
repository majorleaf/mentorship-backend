import AuthModel from "../models/authSchema.js";

// Get user data by ID
const getUserData = async (req, res) => {
    try {
        const { id } = req.params;

        const userData = await AuthModel.findById(id).select("-password");
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ userData });
    } catch (error) {
        console.error("getUserData error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Edit user profile
const EditProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, bio, skills, goal } = req.body; 

        const user = await AuthModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update only if new data is provided
        user.name = name || user.name;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.skills = skills || user.skills;
        user.goal = goal || user.goal;

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user: user.toObject({ getters: true, versionKey: false }) // cleaner JSON
        });
    } catch (error) {
        console.error("EditProfile error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export { getUserData, EditProfile };
