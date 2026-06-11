import mongoose from "mongoose";
import envConfig from "./dotenv.config.js";

/**
   * @name ConnectionDB
   * @description Asynchronous function that establishes a connection to the MongoDB database using Mongoose. It logs a success message with the host name if the connection is successful, or logs an error message and throws the error if the connection fails. This function is crucial for ensuring that the application can interact with the database before starting the server.
   * @access Public
*/


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