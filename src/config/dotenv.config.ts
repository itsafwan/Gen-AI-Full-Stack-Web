import {  configDotenv } from "dotenv";

configDotenv();

const requiredEnvVariables =[
  "PORT",
  "MONGO_URI"
];

requiredEnvVariables.forEach((variableName)=>{
 if(!process.env[variableName]){
  throw new Error(`Environment variable ${variableName} is required but not defined.`);
 }
})

const envConfig = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || ""
}

export default envConfig;