import { createContext } from "react";

interface TechnicalQuestion {
  question: string;
  intention: string;
  answer: string;
}

interface BehavioralQuestion {
  question: string;
  intention: string;
  answer: string;
}

interface SkillGap {
  skill: string;
  severity: "low" | "medium" | "high";
}

interface PreparationPlan {
  day: number;
  focus: string;
  task: string[];
}

interface AiMetadata {
  model: string;
  promptVersion: string;
  processingTime?: number;
  tokensUsed?: number;
}

export interface Report {
  _id: string;
  jobDescription: string;
  resume: string;
  selfDescription: string;
  matchscore: number;
  technicalQuestions: TechnicalQuestion[];
  behavioraltechnicalQuestion: BehavioralQuestion[];
  skillgap: SkillGap[];
  preparationplan: PreparationPlan[];
  aiMetadata: AiMetadata;
  user: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface InterviewContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  report: Report | null;
  setReport: React.Dispatch<React.SetStateAction<Report | null>>;
  reports: Report[];
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
}

export const InterviewContext = createContext<InterviewContextType | null>(null)