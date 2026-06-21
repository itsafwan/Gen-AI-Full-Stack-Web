import { GoogleGenAI } from "@google/genai";
import envConfig from "../config/dotenv.config.js";
import interviewmodel from "../models/interview.model.js";
import {z} from "zod";

interface InterviewInput {
  resume: string;
  selfDescription: string;
  jobDescription: string;
}

const interviewReportSchema = z.object({
  technicalQuestions: z.array(z.object({
  question: z.string().describe("A challenging technical question relevant to the job description."),
  intention: z.string().describe("Explain what skill or trait the interviewer is testing for with this question."),
  answer: z.string().describe("Provide a professional answer using the STAR method, focusing on technical depth and problem-solving."),
  })).describe("A list of likely technical interview questions that may be asked for this role, including the interviewer's intention and an ideal answer."),

  behavioralQuestions: z.array(z.object({
  question: z.string().describe("A behavioral interview question designed to evaluate communication, teamwork, leadership, adaptability, conflict resolution, ownership, or cultural fit."),
  intention: z.string().describe("Explain what personality trait, soft skill, or workplace behavior the interviewer is trying to assess."),
  answer: z.string().describe("Provide a professional answer using the STAR method. The answer should demonstrate clear communication, ownership, impact, and lessons learned."),
  })).describe("A list of behavioral interview questions along with the interviewer's intention and sample high-quality answers."),

  skillGaps: z.array(z.object({
  skill: z.string().describe("A skill, technology, concept, or experience required by the job description that is missing or weak in the candidate's profile."),
  severity: z.enum(["low", "medium", "high"]).describe("Indicates how critical this skill gap is for succeeding in the target role."),
  })).describe("A list of identified skill gaps between the candidate's resume and the job requirements, including their importance and recommendations for improvement."),

  preparationPlan: z.array(z.object({
  day: z.number().describe("The day is the preparation plan, starting from 1."),
  focus: z.string().describe("The primary topic or objective for the day, such as JavaScript, React, System Design, DSA, Behavioral Preparation, or Mock Interviews."),
  task: z.array(z.string()).describe("A detailed list of actionable tasks, exercises, study activities, or practice sessions to complete on that day."),
  })).describe("A structured day-by-day interview preparation roadmap designed to close skill gaps, strengthen strengths, and maximize interview performance."),
  matchScore: z.number().min(0).max(100).describe("Resume to JD match score.")
});


const geminiSchema = {
  type: "object",
  properties: {
    technicalQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" },
        },
        required: ["question", "intention", "answer"],
      },
    },
    behavioralQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" },
        },
        required: ["question", "intention", "answer"],
      },
    },
    skillGaps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skill: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] },
        },
        required: ["skill", "severity"],
      },
    },
    preparationPlan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "number" },
          focus: { type: "string" },
          task: { type: "array", items: { type: "string" } },
        },
        required: ["day", "focus", "task"],
      },
    },
    matchScore: { type: "number" },
  },
  required: ["technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "matchScore"],
};


const ai = new GoogleGenAI({
  apiKey:envConfig.GOOGLE_GENAI_API_KEY
});



export async function generateInterviewReport({ resume, selfDescription, jobDescription }: InterviewInput) {
  console.log("Function entry point...");
  const startTime = Date.now();

  const prompt = `
    You are an expert technical interviewer. 
    Analyze the following resume and job description.
    Resume: ${resume}
    Job Description: ${jobDescription}
    
    Generate technical interview questions that specifically target the gaps between the resume and the job description. 
    Follow the JSON schema strictly.
  `;
  
  console.log("2. Sending request to Gemini...");

  
const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",   // ✅ tumhara model sahi rakha
    contents: prompt,
    config: {
      responseMimeType: "application/json",  // ✅ yeh wala kaam karta hai
      responseSchema: geminiSchema,           // ✅ responseFormat nahi
    },
  });
  
  const rawText = response.text; 
  
  if (!rawText) {
    throw new Error("Failed to get text from AI response");
  }

  const validatedData = interviewReportSchema.parse(JSON.parse(rawText));

  const endTime = Date.now();

  const report = await interviewmodel.create({
    jobDescription,
    resume,
    selfDescription,
    matchscore: validatedData.matchScore, 
    technicalQuestions: validatedData.technicalQuestions,
    behavioraltechnicalQuestion: validatedData.behavioralQuestions, 
    skillgap: validatedData.skillGaps,
    preparationplan: validatedData.preparationPlan,
    aiMetadata: {
      model: "gemini-2.5-flash",
      processingTime: endTime - startTime,
    }
  });

  return report;
}
