import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, "Token is required"],
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 3600 
  }
});


const TokenBlacklistModel = mongoose.model("TokenBlacklist", tokenBlacklistSchema);

export default TokenBlacklistModel;