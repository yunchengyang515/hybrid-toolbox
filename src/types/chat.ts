export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  plan?: TrainingPlan | null;
}

export interface TrainingSession {
  type: 'run' | 'strength' | 'rest';
  activity: string;
  duration?: string;
  details?: string;
}

export interface TrainingPlan {
  id: string;
  userId: string;
  weeklySchedule: {
    day: string;
    session: TrainingSession;
  }[];
  createdAt: Date;
  updatedAt: Date;
}