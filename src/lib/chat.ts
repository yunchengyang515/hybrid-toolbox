import { ChatResponse, TrainingPlan } from '@/types/chat';
import { supabase } from '@/lib/supabase';

// Use window.location.origin to get the current domain
const API_URL = import.meta.env.PROD
  ? '/.netlify/functions'
  : `${window.location.origin}/.netlify/functions`;

// Helper function to get the current auth token
async function getAuthToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  try {
    const token = await getAuthToken();

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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
    const token = await getAuthToken();

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/plan?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching plan:', error);
    throw error;
  }
}
