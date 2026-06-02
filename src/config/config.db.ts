import mongoose from "mongoose";
import envConfig from "./dotenv.config.js";


const ConnectionDB = async ()=>{
  try {
    const connect = await mongoose.connect(envConfig.MONGO_URI);
    console.log(`MongoDB connected: ${connect.connection.host}`);
  }
  catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};



export default ConnectionDB;