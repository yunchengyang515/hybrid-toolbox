import path from 'path';
import { ChatResponse, ConversationHistoryItem, PlanParameters } from '../../../types/shared';

/**
 * Response from the Hybrid Training Planning API
 */
export interface AgentPlanningResponse {
  status?: 'complete' | 'incomplete_profile';
  profile_data?: {
    training_history?: string;
    fitness_background?: string;
    weekly_schedule?: string;
    available_equipment?: string;
    training_goals?: string;
    health_constraints?: string;
  };
  missing_fields?: string[];
  follow_up_questions?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plan?: any;
  recommendations?: string[];
  guidelines?: string;
  message?: string;
}

/**
 * Request parameters for the Hybrid Training Planning API
 */
export interface AgentPlanningRequest {
  user_input: string;
  conversation_history?: ConversationHistoryItem[];
  plan_parameters?: PlanParameters;
}

/**
 * Service for interacting with the Hybrid Training Planning API
 */
export class AgentService {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly apiVersion: string;
  private readonly fullUrl: string;
  private readonly planningUrl: string;

  /**
   * Creates a new AgentService instance
   * @param apiUrl The URL of the Planning API
   * @param apiKey The API key for authentication
   */
  constructor(apiUrl: string, apiKey: string, apiVersion: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.apiVersion = apiVersion;
    this.fullUrl = new URL(`${this.apiVersion}`, this.apiUrl).toString();
    this.planningUrl = path.join(this.fullUrl, 'planning');
  }

  /**
   * Sends a training planning request to the API
   * @param request The planning request object
   */
  async generatePlan(request: AgentPlanningRequest): Promise<AgentPlanningResponse> {
    const url = path.join(this.planningUrl, 'generate-plan-mvp');
    console.log('sending request to planning API:', {
      url,
      request,
    });
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': `${this.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      return (await response.json()) as AgentPlanningResponse;
    } catch (error) {
      console.error('Error calling agent planning API:', error);
      throw error;
    }
  }

  /**
   * Helper to determine if a plan is complete based on the response
   * @param response The API response
   */
  isPlanComplete(response: AgentPlanningResponse): boolean {
    return response.status === 'complete' && !!response.plan;
  }

  /**
   * Formats the API response into a ChatResponse structure
   * @param response The API response to format
   */
  formatChatResponse(response: AgentPlanningResponse): ChatResponse {
    console.log('Formatting API response:', response);

    // Generate a default message based on available data when message and guidelines are empty
    let defaultMessage = '';

    if (
      response.status === 'incomplete_profile' &&
      (!response.message || response.message.trim() === '')
    ) {
      // If we have follow-up questions, use the first one as the message
      if (response.follow_up_questions && response.follow_up_questions.length > 0) {
        defaultMessage = response.follow_up_questions[0];
      } else {
        // Fallback message if no follow-up questions are available
        defaultMessage =
          'I need some more information to create your personalized training plan. Could you provide more details about your fitness goals and experience?';
      }
    } else if (response.status === 'complete' && !response.message && !response.guidelines) {
      // Fallback message for complete status but no message content
      defaultMessage = 'Your personalized training plan is ready! Check out the details below.';
    }

    // Use the actual message, guidelines, or our generated default
    const messageContent = response.message || response.guidelines || defaultMessage;

    return {
      status: response.status,
      message: messageContent,
      profile_data: response.profile_data,
      missing_fields: response.missing_fields,
      follow_up_questions: response.follow_up_questions,
      plan: response.plan,
      recommendations: response.recommendations,
      guidelines: response.guidelines,
    };
  }
}

/**
 * Factory function to create an AgentService
 * @param apiUrl API URL for the planning service
 * @param apiKey API key for the planning service
 */
export function createAgentService(
  apiUrl: string,
  apiKey: string,
  apiVersion: string
): AgentService {
  if (!apiUrl || !apiKey) {
    throw new Error('Missing required parameters: apiUrl or apiKey');
  }

  return new AgentService(apiUrl, apiKey, apiVersion);
}
