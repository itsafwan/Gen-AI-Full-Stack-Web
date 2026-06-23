import { type Request, type Response } from "express";
import pdfParse from "pdf-parse-fork";  
import { generateInterveiwReport } from "../services/ai.service.js";

export async function generateInterviewReportcontroller(req: Request, res: Response) {

  const resume = req.file;

  if (!resume?.buffer) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const pdfData = await pdfParse(resume.buffer);
  
  const resumeText = pdfData.text; 

  const {selfDescription,jobDescription} = req.body

  const interviewReportAi = await generateInterveiwReport({
    resume:resumeText,
    selfDescription,
    jobDescription
  })

  
}