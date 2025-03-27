import { ChatResponse, TrainingPlan } from '@/types/chat';

export interface ChatService {
  sendMessage(message: string): Promise<ChatResponse>;
  getCurrentPlan(userId: string): Promise<TrainingPlan>;
}

export class NetlifyChatService implements ChatService {
  private readonly API_URL = import.meta.env.PROD 
    ? '/.netlify/functions'
    : 'http://localhost:8888/.netlify/functions';

  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

  async getCurrentPlan(userId: string): Promise<TrainingPlan> {
    try {
      const response = await fetch(`${this.API_URL}/plan?userId=${userId}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching plan:', error);
      throw error;
    }
  }
}

// Service factory for dependency injection
export const createChatService = (): ChatService => {
  return new NetlifyChatService();
};