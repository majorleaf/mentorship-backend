import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  availability: {
    type: String,
    enum: ["NOT-AVAILABLE", "AVAILABLE", "PENDING"],
    default: "AVAILABLE",
    required: true
  },
  bio: { type: String, default: "" },
  skills: { type: String },
  goals: { type: String },
}, {
  timestamps: true,
  minimize: false
});

const MentorModel = mongoose.models.Mentor || mongoose.model("Mentor", authSchema);

export default MentorModel;
