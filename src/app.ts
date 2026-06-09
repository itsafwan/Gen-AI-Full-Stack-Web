import express, { type Application } from "express";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

/**
   * @name App Initialization
   * @description Sets up the Express application, including middleware for JSON parsing and routing for authentication-related endpoints. This is the main entry point for the server, where all routes and middleware are configured.
   * @access Public
*/

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

// using auth routes for authentication related endpoints
app.use('/api/v1/auth',authRouter);

export default app;