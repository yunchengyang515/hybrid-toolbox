import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { TrainingPlan } from '../../src/types/chat';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const MOCK_PLAN: TrainingPlan = {
  id: 'mock-plan-1',
  userId: 'mock-user-id',
  weeklySchedule: [
    { day: 'Monday', session: { type: 'run', activity: 'Easy Run', duration: '30 min' } },
    { day: 'Tuesday', session: { type: 'strength', activity: 'Upper Body', details: 'Focus on push/pull exercises' } },
    { day: 'Wednesday', session: { type: 'rest', activity: 'Rest Day' } },
    { day: 'Thursday', session: { type: 'run', activity: 'Interval Training', duration: '40 min' } },
    { day: 'Friday', session: { type: 'strength', activity: 'Lower Body', details: 'Focus on compound movements' } },
    { day: 'Saturday', session: { type: 'run', activity: 'Long Run', duration: '60 min' } },
    { day: 'Sunday', session: { type: 'rest', activity: 'Rest Day' } }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};

const handler: Handler = async (event) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const userId = event.queryStringParameters?.userId;
    
    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User ID is required' })
      };
    }

    // In a real implementation, we would fetch the plan from Supabase
    // const { data, error } = await supabase
    //   .from('plans')
    //   .select('*')
    //   .eq('user_id', userId)
    //   .single();

    const plan = {
      ...MOCK_PLAN,
      userId
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(plan)
    };
  } catch (error) {
    console.error('Error fetching plan:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};

export { handler };