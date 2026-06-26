import { GoogleGenAI } from "@google/genai";
import envConfig from "../config/dotenv.config.js";
import { z } from "zod/v3";
import { zodToJsonSchema } from "zod-to-json-schema";
import puppeteer from "puppeteer";

interface InterviewInput {
  resume: string;
  selfDescription: string;
  jobDescription: string;
}

const interviewReportSchema = z.object({
  technicalQuestions: z.array(z.object({
  question: z.string().describe("A challenging technical question relevant to the job description."),
  intention: z.string().describe("Explain what skill or trait the interviewer is testing for with this question."),
  answer: z.string().describe("Provide a technical answer. If the candidate lacks direct experience for this question, write 'Sample Answer:' followed by a realistic hypothetical solution."),
  })).describe("A list of likely technical interview questions that may be asked for this role, including the interviewer's intention and an ideal answer."),

  behavioraltechnicalQuestion: z.array(z.object({
  question: z.string().describe("A behavioral interview question designed to evaluate communication, teamwork, leadership, adaptability, conflict resolution, ownership, or cultural fit."),
  intention: z.string().describe("Explain what personality trait, soft skill, or workplace behavior the interviewer is trying to assess."),
  answer: z.string().describe("Provide a professional answer using the STAR method. The answer should demonstrate clear communication, ownership, impact, and lessons learned."),
  })).describe("A list of behavioral interview questions along with the interviewer's intention and sample high-quality answers."),

  skillgap: z.array(z.object({
  skill: z.string().describe("A skill, technology, concept, or experience required by the job description that is missing or weak in the candidate's profile."),
  severity: z.enum(["low", "medium", "high"]).describe("Indicates how critical this skill gap is for succeeding in the target role."),
  })).describe("A list of identified skill gaps between the candidate's resume and the job requirements, including their importance and recommendations for improvement."),

  preparationplan: z.array(z.object({
  day: z.number().describe("The day is the preparation plan, starting from 1."),
  focus: z.string().describe("The primary topic or objective for the day, such as JavaScript, React, System Design, DSA, Behavioral Preparation, or Mock Interviews."),
  task: z.array(z.string()).describe("A detailed list of actionable tasks, exercises, study activities, or practice sessions to complete on that day."),
  })).describe("A structured day-by-day interview preparation roadmap designed to close skill gaps, strengthen strengths, and maximize interview performance."),
  title: z.string().describe("The title of the job for which the interview report is generated"),
  matchscore: z.number().min(0).max(100).describe("A score between 0 to 100 indicating how candidate's profile matches the job decription.")
});

const ai = new GoogleGenAI({
  apiKey:envConfig.GOOGLE_GENAI_API_KEY
});

export async function generateInterveiwReport({resume, selfDescription, jobDescription}:InterviewInput) {

  const Prompt = `

You are an expert technical interviewer.

Analyze the candidate profile and job description.

  IMPORTANT RULES:
- IMPORTANT: You MUST generate at least 3 items for technicalQuestions, behavioralQuestions, and skillGaps.
- IMPORTANT: You MUST generate a 7-day preparationPlan.
- You MUST fill ALL fields. NEVER return an empty array [].

- Use information present in the resume/self-description as a base.
- If specific experience is missing, provide a "Sample Answer" that explains how a Senior Developer would approach the problem theoretically.
- You are allowed to generate professional and realistic mock scenarios for Behavioral questions (STAR format) to help the candidate practice, even if they haven't explicitly stated that experience.
- Be conservative with matchScore.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;
  
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

  
  const result = interviewReportSchema.safeParse(JSON.parse(rawText));

  if (!result.success) {
  throw new Error("Failed to generate valid interview report structure");
  }

  return result.data; 
 
}


export async function generatePdfFromHtml(htmlContent: string): Promise<Buffer> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    
    await page.setContent(htmlContent, { waitUntil: "load" });
    await page.waitForNetworkIdle();

    const pdfUint8Array = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    });

    await browser.close();

    return Buffer.from(pdfUint8Array);
}



export async function generateResmuePdf ({resume,selfDescription, jobDescription}:InterviewInput) {

  const resumePdfSchema = z.object({
    html: z.string().describe("The HTML content of the resmue which can be converted to pdf using any library like puppeteer")
  })

  const Prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

                    
    const response = await ai.models.generateContent({
    model:"gemini-2.5-flash",
    contents:Prompt,
    config:{
      responseMimeType:"application/json",
      responseSchema:zodToJsonSchema(resumePdfSchema),  
    }});

    
  const rawText = response.text;

  if (!rawText) {
  throw new Error("No response text received from AI");
 }

  
  const result = resumePdfSchema.safeParse(JSON.parse(rawText));

  if (!result.success) {
  throw new Error("Failed to generate valid interview report structure");
  }

  const pdfBuffer = await generatePdfFromHtml(result.data.html)

    return pdfBuffer                  

}



