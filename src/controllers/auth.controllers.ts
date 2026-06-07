import { type Request, type Response } from "express";
import Usermodel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import envConfig from "../config/dotenv.config.js";

/**
   * @name registerUser
   * @description Handles user registration logic
   * @access Public
   */

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  // Basic validation checks
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try{
   const isUserAlreadyExists = await Usermodel.findOne({ 
      $or:[{ username },{ email }]
    });

    // Check if a user with the same username or email already exists
    if (isUserAlreadyExists) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    // Hash the password before saving to the database
    const HashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance and save it to the database
    const newUser = new Usermodel({
      username,
      email,
      password: HashedPassword,
    });

   // save the new user to the database    
    await newUser.save();

  // 1. Generate short-lived Access Token 
    const accessToken = jwt.sign(
      { id: newUser._id, username: newUser.username },
      envConfig.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // 2. Generate long-lived Refresh Token 
    const refreshToken = jwt.sign(
      { id: newUser._id },
      envConfig.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // 3. Set Refresh Token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
    });
  
  /// 4. Return success response with Access Token in body
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken, 
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });

  } catch (error) {
   // Handle any errors that occur during the registration process
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error" });
  }

  
};

/**
   * @name loginUser
   * @description Handles user login logic
   * @access Public
   */

export const loginUser = async (req: Request, res: Response) => {

   // Extract email and password from the request body
   const { email, password } = req.body;

   try{
      // Find the user in the database by email
      const user = await Usermodel.findOne({email});

      // If user is not found, return an error response
      if(!user){
         return res.status(400).json({
            message:"Invaild email or password"
         })
      };
      // Compare the provided password with the hashed password stored in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // If the password is invalid, return an error response
      if(!isPasswordValid){
         return res.status(400).json({
            message:"Invaild email or password"
         })
      };
      // 1. Generate short-lived Access Token 
    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      envConfig.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // 2. Generate long-lived Refresh Token 
    const refreshToken = jwt.sign(
      { id: user._id },
      envConfig.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

   // 3. Set Refresh Token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
    });

   // 4. Return success response with Access Token in body 
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      accessToken, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

   } catch(error){
   // Handle any errors that occur during the registration process
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Server error" });
   }

}


export const logout = async (req: Request, res: Response) => {

}