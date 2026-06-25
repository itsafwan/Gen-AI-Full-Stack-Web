import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect, useRef } from "react"
import { InterviewContext } from "../context/InterviewContext";
import type { Report } from "../context/InterviewContext";
import { useParams } from "react-router"

interface GenerateReportParams {
  jobDescription: string;
  selfDescription: string;
  resumeFile: File;
}

export const useInterview = () => {

  const context = useContext(InterviewContext)
  const { interviewId } = useParams<{ interviewId: string }>()

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider")
  }

  const { loading, setLoading, report, setReport, reports, setReports } = context

  const generateReport = async ({ jobDescription, selfDescription, resumeFile }: GenerateReportParams): Promise<Report | null> => {
    setLoading(true)
    let response = null
    try {
      response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
      setReport(response.interviewReport)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
    return response?.interviewReport ?? null
  }

  const getReportById = async (interviewId: string): Promise<Report | null> => {
    setLoading(true)
    let response = null
    try {
      response = await getInterviewReportById(interviewId)
      setReport(response.interviewReport)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
    return response?.interviewReport ?? null
  }

  const getReports = async (): Promise<Report[] | null> => {
    setLoading(true)
    let response = null
    try {
      response = await getAllInterviewReports()
      setReports(response.interviewReports)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
    return response?.interviewReports ?? null
  }

  const getResumePdf = async (interviewReportId: string): Promise<void> => {
    setLoading(true)
    try {
      const response = await generateResumePdf({ interviewReportId })
      const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `resume_${interviewReportId}.pdf`)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const getReportByIdRef = useRef(getReportById)
  const getReportsRef = useRef(getReports)

  useEffect(() => {
    if (interviewId) {
      getReportByIdRef.current(interviewId)
    } else {
      getReportsRef.current()
    }
  }, [interviewId])

  return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }
}