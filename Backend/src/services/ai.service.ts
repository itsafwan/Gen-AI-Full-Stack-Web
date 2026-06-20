import { GoogleGenAI } from "@google/genai";
import envConfig from "../config/dotenv.config.js";
import interviewmodel from "../models/interview.model.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

interface InterviewInput {
  resume: string;
  selfDescription: string;
  jobDescription: string;
}

const interviewReportSchema = z.object({
  technicalQuestions: z.array(z.object({
    question: z.string(),
    intention: z.string(),
    answer: z.string(),
  })),
});

const ai = new GoogleGenAI({
  apiKey:envConfig.GOOGLE_GENAI_API_KEY
});


export async function generateInterviewReport({ resume, selfDescription, jobDescription }: InterviewInput) {
  const startTime = Date.now();

  
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: `Analyze this resume: ${resume} and JD: ${jobDescription}. Return JSON.`,
  });

  
  const rawText = response?.text; 

    if (!rawText) {
     throw new Error("Failed to get text from AI response");
    }

    const parsedData = JSON.parse(rawText);

    const validatedData = interviewReportSchema.parse(parsedData);

  const endTime = Date.now();

  const report = await interviewmodel.create({
    jobDescription,
    resume,
    selfDescription,
    technicalQuestion: validatedData.technicalQuestions,
    aiMetadata: {
      model: "gemini-1.5-flash",
      processingTime: endTime - startTime,
    }
  });

  return report;
}
