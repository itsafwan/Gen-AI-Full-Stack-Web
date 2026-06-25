import { type Request, type Response } from "express";
import pdfParse from "pdf-parse-fork";  
import { generateInterveiwReport } from "../services/ai.service.js";
import interviewmodel from "../models/interview.model.js";

export async function generateInterviewReportcontroller(req: Request, res: Response) {
  try {
    const resume = req.file;

    if (!resume?.buffer) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!req.userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // 1. PDF Parsing
    const pdfData = await pdfParse(resume.buffer);
    const resumeText = pdfData.text; 

    // 2. AI Service Call
    const { selfDescription, jobDescription } = req.body;
    const interviewReportByAi = await generateInterveiwReport({
      resume: resumeText,
      selfDescription,
      jobDescription
    });

    // 3. Database Save
    const interviewReport = await interviewmodel.create({
      user: req.userId,
      resume: resumeText,
      selfDescription,
      jobDescription,
      ...interviewReportByAi
    });
    
    return res.status(201).json({
      success: true,
      message: "Interview report generated successfully",
      interviewReport
    });

  } catch (error) {
    // Error handling: for Server
    console.error("Error in generateInterviewReportcontroller:", error);
    return res.status(500).json({ 
      success: false, 
      message: "An internal server error occurred while generating the report." 
    });
  }
}

export async function getinterviewReportByIdController(req: Request, res: Response){

  const {interviewId} = req.params

  const interviewReport = await interviewmodel.findById({_id:interviewId, user:req.userId})

  if(!interviewReport){
    return res.status(404).json({
      message:"Interview report not found"
    })
  }  

  res.status(200).json({
    success:true,
    message:"Interview report fetched successfully",
    interviewReport
  })

}