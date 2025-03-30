import { ChatResponse, TrainingPlan } from '@/types/chat';

// Use window.location.origin to get the current domain
const API_URL = import.meta.env.PROD 
  ? '/.netlify/functions'
  : `${window.location.origin}/.netlify/functions`;

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
      throw new Error(`HTTP error! status: ${response.status}`);
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching plan:', error);
    throw error;
  }
}