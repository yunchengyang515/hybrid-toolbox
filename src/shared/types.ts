// Shared types between frontend and backend

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ConversationHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface PlanParameters {
  duration_weeks: number;
  emphasis:
    | 'balanced'
    | 'running'
    | 'strength'
    | 'endurance'
    | 'flexibility'
    | 'weight_loss'
    | 'muscle_gain';
}

export interface ProfileData {
  training_history?: string;
  fitness_background?: string;
  weekly_schedule?: string;
  available_equipment?: string;
  training_goals?: string;
  health_constraints?: string;
}

export interface DailySession {
  day: string;
  session: {
    type: 'run' | 'strength' | 'rest' | 'cross_training' | 'flexibility';
    activity: string;
    duration?: string;
    details?: string;
  };
}

export interface TrainingPlan {
  id: string;
  userId: string;
  title?: string;
  description?: string;
  weeklySchedule: DailySession[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatResponse {
  status?: 'complete' | 'incomplete_profile';
  message: string;
  profile_data?: ProfileData;
  missing_fields?: string[];
  follow_up_questions?: string[];
  plan?: TrainingPlan;
  recommendations?: string[];
  guidelines?: string;
}

// Authentication types
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isMockMode: boolean;
}
