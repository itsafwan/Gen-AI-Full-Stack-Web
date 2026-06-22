import { type Request, type Response } from "express";
import pdfParse from "pdf-parse-fork";  

export async function generateInterviewReport(req: Request, res: Response) {

  const resume = req.file;

  if (!resume?.buffer) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const resumeContent = await pdfParse(resume.buffer);  
  const {selfDescription,jobDescription} = req.body
}