import { Handler } from '@netlify/functions';
import { validateAuth, corsHeaders, unauthorizedResponse } from '../auth-utils';
import { ChatResponse, TrainingPlan } from '../../../types/shared';

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
    // Extract data from the request body according to the API documentation
    const {
      message,
      conversation_history = [],
      plan_parameters = {},
    } = JSON.parse(event.body || '{}');

    console.log('Received message:', message);
    console.log('Conversation history:', conversation_history);

    if (!message) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // Prepare request to the external planning API
    // In a real implementation, this would call the actual API endpoint
    // For now, we'll simulate the API responses

    // Set default plan parameters if not provided
    const planParameters = {
      duration_weeks: plan_parameters.duration_weeks || 4,
      emphasis: plan_parameters.emphasis || 'balanced',
    };

    // Format the API request according to the documentation
    const apiRequest = {
      user_input: message,
      plan_parameters: planParameters,
      conversation_history,
    };

    console.log('Prepared API request:', apiRequest);

    // For the MVP we'll use simple keyword detection instead of real NLP
    // To mock the external API responses based on conversation length
    const lowerMessage = message.toLowerCase();

    // Mock responses based on conversation history length to simulate the API

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
        "Perfect! Based on everything you've shared, I've created a personalized " +
        planParameters.duration_weeks +
        '-week hybrid training plan that combines running and strength training. ' +
        'This plan is ' +
        (planParameters.emphasis === 'balanced'
          ? 'balanced between running and strength training'
          : planParameters.emphasis === 'running'
            ? 'focused more on running performance'
            : 'focused more on strength development') +
        ". You can view and follow your new plan in the 'My Plans' section.",
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
        title: `${planParameters.duration_weeks}-Week ${planParameters.emphasis.charAt(0).toUpperCase() + planParameters.emphasis.slice(1)} Hybrid Training Plan`,
        description: `A ${planParameters.emphasis} training program designed based on your fitness profile and goals.`,
      },
      recommendations: [
        'Stay hydrated throughout your training sessions',
        'Focus on proper nutrition for recovery',
        'Get 7-8 hours of sleep for optimal recovery',
      ],
      guidelines: `This ${planParameters.duration_weeks}-week plan is designed to help you progress steadily. Follow the running schedule closely and adjust weights for strength training as needed. Rest days are crucial for recovery - don't skip them!`,
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
