import { Router } from "express";
import * as authController from "../controllers/auth.controllers.js";


const authRouter = Router();

/**
   * @routes POST /api/v1/auth/ all routes related to authentication will be prefixed with /api/v1/auth
   * @description Authorization and authentication related routes for user registration, login, password reset, etc.
   * @access Public
*/
authRouter.post("/register", authController.registerUser);

/**
   * @routes POST /api/v1/auth/login
   * @description Handles user login logic, including credential verification and JWT token generation
   * @access Public
*/
authRouter.post("/login", authController.loginUser);

/**
   * @routes POST /api/v1/auth/logout
   * @description Handles user logout logic, including token invalidation and cookie clearing
   * @access Public
*/
authRouter.post("/logout", authController.logoutUser);



export default authRouter;