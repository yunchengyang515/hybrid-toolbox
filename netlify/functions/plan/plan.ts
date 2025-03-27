import { Handler } from '@netlify/functions';
import { TrainingPlan } from '../../src/types/chat';

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

    const plan = {
      ...MOCK_PLAN,
      userId
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(plan)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};

export { handler };