import { Router } from "express";
import * as authController from "../controllers/auth.controllers.js";


const authRouter = Router();

/**
   * @routes POST /api/v1/auth/ all routes related to authentication will be prefixed with /api/v1/auth
   * @description Authorization and authentication related routes for user registration, login, password reset, etc.
   * @access Public
*/

authRouter.post("/register", authController.registerUser);



export default authRouter;