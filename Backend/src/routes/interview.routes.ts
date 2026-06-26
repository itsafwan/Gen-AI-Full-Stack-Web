import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { generateInterviewReportcontroller, generateResumePdfController, getallinterviewReportsController, getinterviewReportByIdController } from "../controllers/interview.controllers.js";
import { upload } from "../middlewares/file.middleware.js";


const interviewRouter = Router();

/**
   * @routes POST /api/v1/auth/ all routes related to gemini ai will be prefixed with /api/v1/interview
   * @description generate new interview report on the basis of user self description,resmue, pdf and job description
   * @access private
*/


interviewRouter.post("/generate", authUser, upload.single("resume"), generateInterviewReportcontroller)


/**
   * @routes Get /api/v1/auth/ all routes related to gemini ai will be prefixed with /api/v1/interview
   * @description get interview report by interviewId
   * @access private
*/

interviewRouter.get("/report/:interviewId",authUser,getinterviewReportByIdController)

/**
   * @routes Get /api/v1/auth/ all routes related to gemini ai will be prefixed with /api/v1/interview
   * @description get all interview reports of logged in user
   * @access private
*/

interviewRouter.get("/",authUser,getallinterviewReportsController)


interviewRouter.post("/resume/pdf/:interviewReportId",authUser,generateResumePdfController)



export default interviewRouter