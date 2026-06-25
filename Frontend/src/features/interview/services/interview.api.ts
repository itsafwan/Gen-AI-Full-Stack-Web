import axios from "axios";

interface Filedata {
  jobDescription: string;
  selfDescription: string;
  resumeFile: File;  
}

interface Reportid{
 interviewReportId :string
}

const apiClient = axios.create({
  baseURL: "/api/v1/interview",
  withCredentials: true
})

/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */

export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }: Filedata) => {

  const formData = new FormData();
  formData.append("jobDescription", jobDescription)
  formData.append("selfDescription", selfDescription)
  formData.append("resume", resumeFile)  

  const response = await apiClient.post("/generate", formData, {  
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return response.data
}

/**
 * @description Service to get interview report by interviewId.
 */

export const getInterviewReportById = async (interviewId: string) => {
  const response = await apiClient.get(`/report/${interviewId}`)
  return response.data
}

/**
 * @description Service to get all interview reports of logged in user.
 */


export const getAllInterviewReports = async () => {
    const response = await apiClient.get("/")

    return response.data
}

/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */


export const generateResumePdf = async ({ interviewReportId}:Reportid) => {
    const response = await apiClient.post(`/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    })

    return response.data
}