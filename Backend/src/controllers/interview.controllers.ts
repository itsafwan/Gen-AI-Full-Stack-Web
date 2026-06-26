import { type Request, type Response } from "express";
import pdfParse from "pdf-parse-fork";  
import { generateInterveiwReport,generateResmuePdf } from "../services/ai.service.js";
import interviewmodel from "../models/interview.model.js";
import { Types } from "mongoose";

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
      ...interviewReportByAi,
      title: interviewReportByAi.title
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

export async function getinterviewReportByIdController(req: Request, res: Response) {
  const { interviewId } = req.params

  if (!interviewId || typeof interviewId !== 'string' || !Types.ObjectId.isValid(interviewId)) {
    return res.status(400).json({ message: "Invalid interview ID" })
  }

  if (!req.userId || !Types.ObjectId.isValid(req.userId)) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const interviewReport = await interviewmodel.findOne({
    _id: new Types.ObjectId(interviewId),
    user: new Types.ObjectId(req.userId)
  })

  if (!interviewReport) {
    return res.status(404).json({ message: "Interview report not found" })
  }

  res.status(200).json({
    success: true,
    message: "Interview report fetched successfully",
    interviewReport
  })
}


export async function getallinterviewReportsController(req: Request, res: Response) {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  
  const interviewReports = await interviewmodel
    .find({ user: userId }) 
    .sort({ createdAt: -1 })
    .select("-resume -selfDescription -jobDescription -technicalQuestions -behavioraltechnicalQuestion -skillgap -preparationplan");

  res.status(200).json({
    message: "Interview reports fetched successfully.",
    interviewReports
  });
}

export async function generateResumePdfController(req: Request, res: Response) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewmodel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    if (!resume || !jobDescription || !selfDescription) {
    return res.status(400).json({
        message: "Interview report is incomplete. Required fields are missing."
    })
}

    const pdfBuffer = await generateResmuePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}