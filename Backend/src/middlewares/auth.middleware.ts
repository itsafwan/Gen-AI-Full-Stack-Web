import { type Request, type Response, type NextFunction } from "express";
import JWT, { type JwtPayload } from "jsonwebtoken";
import envConfig from "../config/dotenv.config.js";
import TokenBlacklistModel from "../models/tokenblacklist.model.js";

/**
   * @name authUser
   * @description Middleware to authenticate user based on JWT access token. It checks for the presence of the access token in the Authorization header, verifies its validity, and checks if it's blacklisted. If the token is valid and not blacklisted, it allows the request to proceed to the next middleware or route handler. If the token is invalid, expired, or blacklisted, it returns an appropriate error response.
   * @access Private
   */


export async function authUser(req: Request, res: Response, next: NextFunction) {
  
  const authHeader = req.headers.authorization;
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ message: "Access Token not provided" });
  }

  try {
    const isBlacklisted = await TokenBlacklistModel.findOne({ token: accessToken });
    
    if (isBlacklisted) {
      return res.status(401).json({ message: "Token is blacklisted, please login again" });
    }

  const decoded = JWT.verify(accessToken, envConfig.ACCESS_TOKEN_SECRET) as JwtPayload & { id: string };
  req.userId = decoded.id;  
  return next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}