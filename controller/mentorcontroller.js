import MentorModel from "../models/mentorSchema.js";
import bcrypt from "bcryptjs";

const addMentor = async (req, res) => {   
  try {
    const { name, email, password, availabilty, bio, topic } = req.body;

    // Generate salt & hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const mentor = new MentorModel({
      name,
      email,
      password: hashPassword, 
      availabilty,
      bio,
      topic,
    });

    await mentor.save();

    return res.status(201).json({
      success: true,
      message: "Mentor added successfully",
      data: mentor
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const Booksession = async (req, res) => {   
  try {
    // your logic here
    return res.status(200).json({ message: "Booksession endpoint working" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMentor = async (req,res)=> {
    try {
        
        const mentors = await MentorModel.find()
        res.status(200).json({mentors})

  } catch (error) {
        console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export { addMentor, getMentor, Booksession };
