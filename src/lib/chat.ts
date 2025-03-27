import { ChatResponse, TrainingPlan } from '@/types/chat';

const API_URL = import.meta.env.PROD 
  ? '/.netlify/functions'
  : 'http://localhost:8888/.netlify/functions';

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_URL}/chat`, {
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

export async function getCurrentPlan(userId: string): Promise<TrainingPlan> {
  try {
    const response = await fetch(`${API_URL}/plan?userId=${userId}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching plan:', error);
    throw error;
  }
}