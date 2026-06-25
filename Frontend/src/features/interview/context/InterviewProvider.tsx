import { useState } from "react";
import { InterviewContext } from "./InterviewContext";
import type { Report } from "./InterviewContext";

export const InterviewProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<Report | null>(null)
  const [reports, setReports] = useState<Report[]>([])

  return (
    <InterviewContext.Provider value={{ loading, setLoading, report, setReport, reports, setReports }}>
      {children}
    </InterviewContext.Provider>
  )
}