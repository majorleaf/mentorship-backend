import User from "../models/userSchema.js";

// GET /apsi/users/:id/stats ... .. Returns mentee dashboard stats 
const getUserStats = async (req, res) => {
    try {
        const { id } = req.params;
        
        //Make sure users can only fetch their own stats
        if (req.user.id != id) {
           return res.status(403).json({ message: "Forbidden"});
        }

        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // real counts  once there are sessions,aichats, models but for now 0 so the dashboard doesn't break
        const stats = {
            aiChats: user.aiChats || 0,
            sessionsBooked: user.sessionsBooked || 0,
            milestones: user.milestones || 0,
            mentors: user.mentors?. length || 0,
        };

        return res.status(200).json(stats);
    } catch (error) {
        console.log("getUserStats error:", error);
        return res.status(500).json({ message: "Server error"});
    }
};

// GET /api/mentors/recommended
const getRecommendedMentors = async (req, res) => {
    try {
        // Fetch up to 6 uers with the role mentors 
        // NB: ADDING MATCHING LOGIC BASED ON MENTEE PREFERENCES AND SKILLS WILL BE ADDED LATER
        const mentors = await User.find({ role: "mentor"})
        .select("_id name title expertise rating sessionsCount")
        .limit(6)
        .lean();

        return res.status(200).json(mentors);
    } catch (error) {
       console.log("getRecommendedMentors error:", error);
       return res.status(500).json({ message: "Server error"}); 
    }
};

const getUpcomingSessions = async (req, res) => {
    try {
         // You don't have a Session model yet so return empty array
    // Once you build sessions, replace this with:
    // const sessions = await Session.find({
    //   menteeId: req.user.id,
    //   date: { $gte: new Date() },
    // }).sort({ date: 1 }).limit(3).populate('mentorId', 'name');
     return res.status(200).json([]);
    } catch (error) {
        console.log("getUpcomingSessions error:", error);
        return res.status(500).json({ message: "Server error"});
    }
};

export { getUserStats, getRecommendedMentors, getUpcomingSessions };