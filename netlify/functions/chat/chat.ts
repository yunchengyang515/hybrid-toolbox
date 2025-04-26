import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { ChatResponse, TrainingPlan } from '../../src/types/chat';
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

// Simple mock keyword triggers
const KEYWORDS = {
  plan: ['plan', 'schedule', 'program', 'routine'],
  goals: ['goal', 'improve', 'better', 'faster', 'stronger'],
  experience: ['experience', 'history', 'background', 'years', 'month'],
  equipment: ['equipment', 'gym', 'dumbbell', 'barbell', 'machine'],
  schedule: [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
    'weekend',
    'weekday',
  ],
  constraints: ['injury', 'pain', 'issue', 'problem', 'hurt', 'sore'],
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

  if (event.httpMethod !== 'POST') {
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
    const { message, conversation_history = [] } = JSON.parse(event.body || '{}');

    console.log('Received message:', message);
    console.log('Conversation history:', conversation_history);

    if (!message) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // For the MVP we'll use simple keyword detection instead of real NLP
    // To mock the profile-building conversation flow
    const lowerMessage = message.toLowerCase();

    // Count how many keyword categories are mentioned in the entire conversation
    const conversationText = [message, ...conversation_history.map(item => item.content)]
      .join(' ')
      .toLowerCase();

    let keywordMatches = 0;
    for (const category in KEYWORDS) {
      if (KEYWORDS[category].some(keyword => conversationText.includes(keyword))) {
        keywordMatches++;
      }
    }

    // First response - incomplete profile
    if (conversation_history.length === 0) {
      const response: ChatResponse = {
        status: 'incomplete_profile',
        message:
          'Thanks for sharing! To create your personalized plan, I need a bit more information. Could you tell me about your weekly availability for training and any specific equipment you have access to?',
        profile_data: {
          training_goals: lowerMessage.includes('goal') ? 'Initial goals detected' : undefined,
          fitness_background: lowerMessage.includes('experience')
            ? 'Some experience mentioned'
            : undefined,
        },
        missing_fields: ['weekly_schedule', 'available_equipment'],
        follow_up_questions: [
          'What days of the week are you available to train, and for how long?',
        ],
      };

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
        body: JSON.stringify(response),
      };
    }

    // Second response - still incomplete
    if (conversation_history.length === 2) {
      const response: ChatResponse = {
        status: 'incomplete_profile',
        message:
          'Great, thanks for that information. One last question - do you have any injuries or health concerns I should be aware of when creating your plan?',
        profile_data: {
          training_goals: 'Goals extracted from conversation',
          weekly_schedule:
            lowerMessage.includes('monday') || lowerMessage.includes('tuesday')
              ? 'Schedule information provided'
              : 'General availability noted',
          available_equipment: lowerMessage.includes('gym') ? 'Gym access' : 'Home equipment',
          fitness_background: 'Some experience mentioned',
        },
        missing_fields: ['health_constraints'],
        follow_up_questions: [
          'Do you have any injuries or physical limitations I should consider in your training plan?',
        ],
      };

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
        body: JSON.stringify(response),
      };
    }

    // Final response - complete profile with plan
    const response: ChatResponse = {
      status: 'complete',
      message:
        "Perfect! Based on everything you've shared, I've created a personalized 4-week hybrid training plan that combines running and strength training. This plan is designed to help you reach your goals while accounting for your schedule and experience level. You can view and follow your new plan in the 'My Plans' section.",
      profile_data: {
        training_goals: 'Goals extracted from conversation',
        weekly_schedule: 'Schedule information confirmed',
        available_equipment: 'Equipment access verified',
        fitness_background: 'Experience level determined',
        health_constraints:
          lowerMessage.includes('injury') || lowerMessage.includes('pain')
            ? 'Health concerns noted'
            : 'No reported issues',
      },
      missing_fields: [],
      follow_up_questions: [],
      plan: {
        ...MOCK_PLAN,
        userId: user.id,
      },
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error processing chat message:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

export { handler };
