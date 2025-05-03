import { Handler } from '@netlify/functions';
import { validateAuth, corsHeaders, unauthorizedResponse } from '../auth-utils';
import { createAgentService } from '../services/agent.service';

// Only keep this for fallback in case the API fails

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

    // Check for required environment variables
    const apiUrl = process.env.AGENT_API_URL;
    const apiKey = process.env.AGENT_API_KEY;
    const apiVersion = process.env.AGENT_API_VERSION;

    if (!apiUrl || !apiKey || !apiVersion) {
      console.error('Missing required environment variables: AGENT_API_URL or AGENT_API_KEY');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    try {
      // Create agent service
      const agentService = createAgentService(apiUrl, apiKey, apiVersion);

      // Call the planning API through our agent service
      const planningResponse = await agentService.generatePlan(apiRequest);
      console.log(
        'Received API response:',
        JSON.stringify(planningResponse).substring(0, 200) + '...'
      );

      // If we have a complete plan response, add the user ID to the plan
      if (planningResponse.status === 'complete' && planningResponse.plan) {
        planningResponse.plan.userId = user.id;
      }

      // Format the response using the service helper
      const formattedResponse = agentService.formatChatResponse(planningResponse);

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
        body: JSON.stringify(formattedResponse),
      };
    } catch (apiError) {
      console.error('Error calling external API:', apiError);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Failed to communicate with planning service' }),
      };
    }
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
