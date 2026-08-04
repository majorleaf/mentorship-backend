import AuthModel from "../models/userSchema.js";
import Organization from "../models/organisation.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userSchema.js";

// user registration controller 
const register = async (req, res) => {
  const salt = 10;
  try {
    // Structure new fields to support B2C and B2B flows 
    const { name, email, password, role  = "mentee", accountType = "b2b", companyName } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if user already exists
    const existUser = await User.findOne({ email: email.toLowerCase() });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    let organizationId = null;
    let finalRole = role;
    
   // if this is a B2B signup and they provide a company name, create org
   if (accountType === "b2b" && companyName) {
    const org = new Organization({ name: companyName });
    await org.save();
    organizationId = org._id;
    // The person creating the account defaults to HR admin
    finalRole = "hr_Admin"; 
   }

    // hash password
    const hashPassword = await bcrypt.hash(password, salt);

    // create user 
    const user = new AuthModel({
      name,
      email,
      password: hashPassword,
      role: finalRole,
      accountType,
      organizationId,
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id,
      name: user.name,
      role: user.role,
      accountType: user.accountType,
    organizationId: user.organizationId
   },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "3d" }
    );

    // Set cookie
    // sameSite is none , frontend and backend are on different domains
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    return res.status(201).json({
      message: "User registered successfully",
      token,  // send token back
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountType: user.accountType,
        organizationId: user.organizationId,
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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role,
        accountType: user.accountType,
        organizationId: user.organizationId,
       },
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
      //  send token back
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountType: user.accountType,
        organizationId: user.organizationId
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
      sameSite: "none",
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

    const userData = await User.findById(id).select("-password").populate("organizationId", "name subscriptionPlan"); // fixed variable name
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ userData });
  } catch (error) {
    console.log("get user data error:", error);
    return res.status(500).json({ message: "server error fetching user data" });
  }
};

export { register, login, Logout, getUserData };
