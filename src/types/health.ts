export interface AssessmentQuestion {
  id: number;
  category: 'mental' | 'sleep' | 'physical' | 'academic' | 'lifestyle';
  question: string;
  type: 'slider' | 'choice';
  options?: string[];
  min?: number;
  max?: number;
  labels?: { min: string; max: string };
}

export interface AssessmentAnswer {
  questionId: number;
  value: number | string;
}

export interface AssessmentResult {
  stressScore: number;
  wellnessScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  aiSummary: string;
  categoryScores: {
    mental: number;
    sleep: number;
    physical: number;
    academic: number;
    lifestyle: number;
  };
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface WellnessGoal {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
}

export interface DailyLog {
  date: string;
  stressScore: number;
  wellnessScore: number;
  sleepHours: number;
  steps: number;
  goalsCompleted: number;
  totalGoals: number;
}
