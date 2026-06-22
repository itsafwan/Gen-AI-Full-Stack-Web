import { GoogleGenAI } from "@google/genai";
import envConfig from "../config/dotenv.config.js";
import { z } from "zod/v3";
import { zodToJsonSchema } from "zod-to-json-schema";

interface InterviewInput {
  resume: string;
  selfDescription: string;
  jobDescription: string;
}

const interviewReportSchema = z.object({
  technicalQuestions: z.array(z.object({
  question: z.string().describe("A challenging technical question relevant to the job description."),
  intention: z.string().describe("Explain what skill or trait the interviewer is testing for with this question."),
  answer: z.string().describe("True if answer is a generated sample because candidate experience was unavailable."),
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
  matchScore: z.number().min(0).max(100).describe("A score between 0 to 100 indicating how candidate's profile matches the job decription.")
});

const ai = new GoogleGenAI({
  apiKey:envConfig.GOOGLE_GENAI_API_KEY
});

export async function generateInterveiwReport({resume, selfDescription, jobDescription}:InterviewInput) {

    const Prompt = `
 You are an expert technical interviewer.

Analyze the candidate profile and job description.

IMPORTANT RULES:

- Use ONLY information present in the resume and self-description.
- Never invent previous jobs, companies, teams, clients, production systems, audits, or work experience.
- Never assume the candidate has worked professionally unless explicitly stated.
- If experience is missing, generate a "Sample Answer" and clearly start the answer with "Sample Answer:".
- Do not create fake STAR stories.
- Be conservative when assigning matchScore.

    Resume: ${resume}
    Self Description:${selfDescription}
    Job Description: ${jobDescription}`
  
  const response = await ai.models.generateContent({
    model:"gemini-2.5-flash",
    contents:Prompt,
    config:{
      responseMimeType:"application/json",
      responseSchema:zodToJsonSchema(interviewReportSchema),  
    }});

    
  const rawText = response.text;

  if (!rawText) {
  throw new Error("No response text received from AI");
 }

  const report = interviewReportSchema.parse(JSON.parse(rawText));
  
  return report;
 
}


  

