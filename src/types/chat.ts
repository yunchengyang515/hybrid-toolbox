export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  message?: string;
  status?: 'complete' | 'incomplete_profile';
  profile_data?: {
    training_history?: string;
    fitness_background?: string;
    weekly_schedule?: string;
    available_equipment?: string;
    training_goals?: string;
    health_constraints?: string;
  };
  missing_fields?: string[];
  follow_up_questions?: string[];
  plan?: TrainingPlan;
}

export interface ConversationHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface TrainingPlan {
  id: string;
  userId: string;
  weeklySchedule: DailySession[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DailySession {
  day: string;
  session: {
    type: 'run' | 'strength' | 'rest';
    activity: string;
    duration?: string;
    details?: string;
  };
}
