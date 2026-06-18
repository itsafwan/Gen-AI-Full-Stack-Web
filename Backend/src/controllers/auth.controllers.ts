import { type Request, type Response } from "express";
import Usermodel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import envConfig from "../config/dotenv.config.js";
import TokenBlacklistModel from "../models/tokenblacklist.model.js";
// import redisclient from "../utils/redisClient.js"; for docker practice only, uncomment if you have redis running locally or in docker

/**
   * @name registerUser
   * @description Handles user registration logic
   * @access Public
   */

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  
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
      sameSite: "lax",
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
      sameSite: "lax",
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

// export const logoutUser = async (req: Request, res: Response) => {
//     // 1. Refresh Token cookie se nikal kar delete karo
//     res.clearCookie('refreshToken', {
//         httpOnly: true,
//         secure: true, 
//         sameSite: 'strict'
//     });

//     // 2. Authorization header se Access Token lo
//     const authHeader = req.headers.authorization;
    
//     // Yahan hum check kar rahe hain ke authHeader exist karta hai
//     if (authHeader && authHeader.startsWith('Bearer ')) {
//         const token = authHeader.split(' ')[1];

//         // Yahan `token!` lagane se TypeScript maan jayega ke yeh undefined nahi hai
//         if (token) {
//             await redisclient.set(token, 'blacklisted', { EX: 3600 });
//         }
//     }

//     res.status(200).json({ message: "Logout successful!" });
// }; for docker practice only, uncomment if you have redis running locally or in docker

/**
   * @name logoutUser
   * @description Handles user logout logic
   * @access Public
   */

export const logoutUser = async (req: Request, res: Response) => {

  const refreshToken = req.cookies.refreshToken;
  const accessToken = req.headers.authorization?.split(" ")[1]; 

  if (!refreshToken) {
    return res.status(400).json({ message: "No refresh token provided" });
  }

  try {
    
    await TokenBlacklistModel.create({ token: refreshToken });

   
    if (accessToken) {
      await TokenBlacklistModel.create({ token: accessToken });
    }

    
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logout successful!" });

  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
   * @name Getuser
   * @description Handles user logic with auth middleware, 
   * @access private
   */

export const Getuser = async (req: Request, res: Response) => {
  try {
   
    let userId = req.userId;

    
    if (!userId) {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized: No token or cookie" });
      }

      
      const decoded = jwt.verify(refreshToken, envConfig.REFRESH_TOKEN_SECRET) as JwtPayload;
      userId = decoded.id;
    }

    const user = await Usermodel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

   
    const newAccessToken = jwt.sign(
      { id: user._id, username: user.username },
      envConfig.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      message: "User details fetched successfully",
      accessToken: newAccessToken,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    return res.status(401).json({ message: "Session expired" });
  }
};


