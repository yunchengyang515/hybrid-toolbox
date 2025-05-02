import { Handler } from '@netlify/functions';
import { TrainingPlan } from '../../../types/shared';
import { validateAuth, corsHeaders, unauthorizedResponse } from '../auth-utils';

const MOCK_PLAN: TrainingPlan = {
  id: 'mock-plan-1',
  userId: 'mock-user-id',
  weeklySchedule: [
    { day: 'Monday', session: { type: 'run', activity: 'Easy Run', duration: '30 min' } },
    {
      day: 'Tuesday',
      session: {
        type: 'strength',
        activity: 'Upper Body',
        details: 'Focus on push/pull exercises',
      },
    },
    { day: 'Wednesday', session: { type: 'rest', activity: 'Rest Day' } },
    {
      day: 'Thursday',
      session: { type: 'run', activity: 'Interval Training', duration: '40 min' },
    },
    {
      day: 'Friday',
      session: { type: 'strength', activity: 'Lower Body', details: 'Focus on compound movements' },
    },
    { day: 'Saturday', session: { type: 'run', activity: 'Long Run', duration: '60 min' } },
    { day: 'Sunday', session: { type: 'rest', activity: 'Rest Day' } },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const handler: Handler = async event => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // Validate authentication
  const { user, error } = await validateAuth(event);
  if (!user || error) {
    console.log('Auth failed:', error);
    return unauthorizedResponse();
  }

  try {
    const userId = event.queryStringParameters?.userId;

    // Security check: ensure the requested userId matches the authenticated user
    if (userId && userId !== user.id) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Access denied: Cannot access another user's plan" }),
      };
    }

    // Use the authenticated user's ID
    const plan = {
      ...MOCK_PLAN,
      userId: user.id,
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      body: JSON.stringify(plan),
    };
  } catch (error) {
    console.error('Error fetching plan:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

export { handler };
