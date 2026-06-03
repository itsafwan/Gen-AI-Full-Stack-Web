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

   // Generate a JWT token for the newly registered user
    const token = jwt.sign({ 
      id: newUser._id, 
      username: newUser.username 
   },
   envConfig.JWT_SECRET,
   { expiresIn: "1d" }
  );

  // Set the token in an HTTP-only cookie for authentication

  res.cookie("token",token ,{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, 
  });
  
  // Respond with success message and user details (excluding password)

  return res.status(201).json({
   success:true,
      message: "User registered successfully",
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
      // Generate a JWT token for the authenticated user
      const token = jwt.sign({ 
         id: user._id, 
         username: user.username 
      },
      envConfig.JWT_SECRET,
      { expiresIn: "1d" }
     );

   // Set the token in an HTTP-only cookie for authentication
   res.cookie("token",token ,{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, 
  });

   return res.status(201).json({
   success:true, 
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

   } catch(error){
   // Handle any errors that occur during the registration process
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error" });
   }

}
