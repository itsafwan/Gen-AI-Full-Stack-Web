import { GoogleGenAI } from "@google/genai";
import envConfig from "../config/dotenv.config.js";

const ai = new GoogleGenAI({
  apiKey:envConfig.GOOGLE_GENAI_API_KEY
});

