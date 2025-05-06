import { sendVerificationCode } from "../middleware/Email.js";
import User from "../model/authModel.js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';


// HTTP status codes
const HTTP_STATUS = {
    404: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
    CREATED: 201,
    SUCCESS: 200,
  };
  
  // Password regex: must be at least 6 characters and contain at least one letter.
  const PASSWORD_REGEX = /^(?=.*[A-Za-z]).{6,}$/;
  
  
  
  
  export const register = async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      console.log( name, email, phone, password)
  
      if (!name || !email || !phone || !password ) {
        return res
          .status(404)
          .json({ status: false, message: "All fields are required" });
      }

  
   
      if (!PASSWORD_REGEX.test(password)) {
        return res.status(404).json({
          status: false,
          message: "Password must be at least 6 characters and include at least one letter",
        });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(404)
          .json({ status: false, message: "User already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
      let newUser = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        verificationToken: otp,
        verificationTokenExpiresAt: Date.now() + 5 * 60 * 1000, // expires in 5 minutes
      });
  
      
  
      await newUser.save();
      await sendVerificationCode(email, otp);
  
      return res.status(200).json({
        status: true,
        message: "Registration successful. Please verify your email.",
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        status: false,
        message: "Registration failed. Please try again.",
      });
    }
  };





  //email verification


  
  export const verifyUser = async (req, res) => {
    try {
      const { email, otp } = req.body;
      console.log(email,otp)
  
      // Find user and include hidden token fields
      const user = await User.findOne({ email })
        .select("+verificationToken +verificationTokenExpiresAt");
  
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }
  
      if (!user.verificationToken) {
        return res
          .status(400)
          .json({ status: false, message: "No pending verification token" });
      }
  
      // Token expired?
      if (Date.now() > user.verificationTokenExpiresAt.getTime()) {
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save({ validateBeforeSave: false });
  
        return res
          .status(402)
          .json({ status: false, message: "Verification token expired" });
      }
  
      if (user.verificationToken !== otp) {
        return res
          .status(401)
          .json({ status: false, message: "Invalid verification token" });
      }
  
      // Success: mark as verified and clear token fields
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;
      await user.save({ validateBeforeSave: false });
  
      return res
        .status(200)
        .json({ status: true, message: "Account verified successfully" });
    } catch (error) {
      console.error("verifyUser error:", error);
      return res
        .status(500)
        .json({ status: false, message: "Verification failed" });
    }
  };
  
  
  
  //login
  
  export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password ) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: false,
          message: "All fields are required",
        });
      }
  
      const user = await User.findOne({ email })
        .select("+password")
  
      if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
          status: false,
          error: "Invalid credentials" 
        });
      }
  
      
  
      if (!user.isVerified) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: false,
          message: "Account not verified (Please verify via forgot password)",
        });
      }
  
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: false,
          message: "Invalid password",
        });
      }
  
      // Generate JWT token
  
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "15d" }
      );
  
      // Add this to your login controller
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        path: "/",
      });
  
      // Set cookie with token
  
  
      return res.status(HTTP_STATUS.SUCCESS).json({
        status: true,
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        status: false,
        message: "Login failed",
      });
    }
  };
  
  
  
  
  // logout
  
  export const logout = async (req, res) => {
    try {
      // Clear authentication cookies/tokens
      res.clearCookie("token");
  
      return res.status(HTTP_STATUS.SUCCESS).json({
        status: true,
        message: "Logout successful",
        redirect: "/login",
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        status: false,
        message: "Logout failed",
      });
    }
  };
  




  