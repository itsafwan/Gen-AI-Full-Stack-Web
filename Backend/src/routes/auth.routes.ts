import { Router } from "express";
import * as authController from "../controllers/auth.controllers.js";
import { authUser } from "../middlewares/auth.middleware.js";


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

/**
   * @routes Get /api/v1/auth/get-user
   * @description  Handles user logout logic, including token invalidation and cookie clearing. This route is used to retrieve the current user's information based on the provided access token. It verifies the access token, checks if it's blacklisted, and returns the user's details if the token is valid. If the token is invalid or blacklisted, it returns an appropriate error response.
   * @access private
*/

authRouter.get("/get-user", authUser,authController.Getuser);



export default authRouter;