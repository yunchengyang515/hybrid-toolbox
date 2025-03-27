import { Handler } from '@netlify/functions';
import { ChatResponse, TrainingPlan } from '../../src/types/chat';

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

const RESPONSE_TEMPLATES = [
  {
    trigger: ['goal', 'goals', 'aim', 'achieve'],
    response: "I understand your goals! Based on what you've shared, I can help create a balanced plan that combines running and strength training. Would you like to see a preview?",
    includePlan: false
  },
  {
    trigger: ['experience', 'background', 'history'],
    response: "Thanks for sharing your background. This will help me tailor the plan to your experience level. Let's look at a potential weekly schedule that matches your capabilities.",
    includePlan: true
  },
  {
    trigger: ['schedule', 'time', 'availability'],
    response: "I'll make sure the plan fits your schedule. Here's a suggested weekly breakdown that should work with your availability.",
    includePlan: true
  }
];

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const { message } = JSON.parse(event.body || '{}');
    
    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    const lowercaseMessage = message.toLowerCase();
    const matchedTemplate = RESPONSE_TEMPLATES.find(template =>
      template.trigger.some(t => lowercaseMessage.includes(t))
    ) || RESPONSE_TEMPLATES[0];

    const response: ChatResponse = {
      message: matchedTemplate.response,
      plan: matchedTemplate.includePlan ? MOCK_PLAN : null
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};

export { handler };