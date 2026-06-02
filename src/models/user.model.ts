import mongoose from "mongoose";

/**
   * @name User Model
   * @description Mongoose schema and model for user data, including fields for username, email, and password. This model will be used for user registration, authentication, and management in the application.
   * @access Public
*/

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: [true,"Username  already taken."],
  },
  email: {
    type: String,
    required: true,
    unique: [true,"Account with this email already exists."],
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("Users", userSchema);

export default User;