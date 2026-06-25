import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { generateInterviewReportcontroller, getinterviewReportByIdController } from "../controllers/interview.controllers.js";
import { upload } from "../middlewares/file.middleware.js";


const interviewRouter = Router();

/**
   * @routes POST /api/v1/auth/ all routes related to gemini ai will be prefixed with /api/v1/interview
   * @description generate new interview report on the basis of user self description,resmue, pdf and job description
   * @access private
*/


interviewRouter.post("/generate",authUser,upload.single("resmue"),generateInterviewReportcontroller)


/**
   * @routes Get /api/v1/auth/ all routes related to gemini ai will be prefixed with /api/v1/interview
   * @description get interview report by interviewId
   * @access private
*/

interviewRouter.get("/report/:interviewId",authUser,upload.single("resmue"),getinterviewReportByIdController)


export default interviewRouter