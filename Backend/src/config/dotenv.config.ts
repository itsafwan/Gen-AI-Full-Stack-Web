import {  configDotenv } from "dotenv";

/**
   * @name Dotenv Configuration
   * @description Loads environment variables from a .env file into process.env, ensuring that required variables like PORT and MONGO_URI are defined. If any required variable is missing, it throws an error to prevent the application from running with incomplete configuration. This setup is essential for managing sensitive information and configuration settings in a secure and flexible manner.
   * @access Public
*/

configDotenv();

const requiredEnvVariables =[
  "PORT",
  "MONGO_URI",
  "REFRESH_TOKEN_SECRET",
  "ACCESS_TOKEN_SECRET",
  "GOOGLE_GENAI_API_KEY"

];

requiredEnvVariables.forEach((variableName)=>{
 if(!process.env[variableName]){
  throw new Error(`Environment variable ${variableName} is required but not defined.`);
 }
})

const envConfig = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
  GOOGLE_GENAI_API_KEY:process.env.GOOGLE_GENAI_API_KEY as string
}

export default envConfig;