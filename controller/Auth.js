import AuthModel from "../models/authSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// user registration controller 
const register = async (req, res) => {
  const salt = 10;
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if user already exists
    const existUser = await AuthModel.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, salt);

    // create user 
    const user = new AuthModel({
      name,
      email,
      password: hashPassword,
      role,
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "3d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    return res.status(201).json({
      message: "User registered successfully",
      token,  // ✅ send token back
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// user login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await AuthModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "3d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      token,  
      // ✅ send token back
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

// user logout controller
const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

// get user data controller
const getUserData = async (req, res) => {
  try {
    const { id } = req.params;

    const userData = await AuthModel.findById(id).select("-password"); // fixed variable name
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

export { register, login, Logout, getUserData };
