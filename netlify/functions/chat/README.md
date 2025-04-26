# Hybrid Training Planning API Usage Guide

This guide explains how to use the Hybrid Training Planning API for generating personalized training plans that combine running and strength training.

## MVP Workflow Overview

The MVP workflow consists of a single comprehensive endpoint that handles both profile extraction and plan generation:

1. **First API call**: Extract profile and get follow-up questions or a complete plan
2. **Additional calls (if needed)**: Answer follow-up questions until profile is complete
3. **Final response**: Receive a personalized hybrid training plan

## Step 1: Initial Profile Submission

Make a POST request to the comprehensive endpoint with the user's initial input:

```http
POST /v1/planning/generate-plan-mvp
```

### Request Format

```json
{
  "user_input": "I want to start a hybrid training program. I'm a runner who does 20 miles per week. I have access to a gym with all equipment and can train Monday, Wednesday, Friday evenings and weekends. My goal is to improve my half marathon time while building some muscle.",
  "plan_parameters": {
    "duration_weeks": 4,
    "emphasis": "balanced"
  }
}
```

### Parameters Explained

- **user_input**: Natural language description of the user's fitness background, goals, and constraints
- **plan_parameters**:
  - **duration_weeks**: Length of the training plan (1-12 weeks)
  - **emphasis**: Focus of the plan ("balanced", "running", or "strength")
- **conversation_history**: Optional array of previous exchanges (used in follow-up requests)

### Response: Incomplete Profile

If the API determines that more information is needed, it will return:

```json
{
  "status": "incomplete_profile",
  "profile_data": {
    "training_history": "Runs 20 miles per week",
    "weekly_schedule": "Available Monday, Wednesday, Friday evenings and weekends",
    "available_equipment": "Full gym access",
    "training_goals": "Improve half marathon time and build muscle"
  },
  "missing_fields": ["fitness_background", "health_constraints"],
  "follow_up_questions": [
    "Can you tell me about your fitness background and any health concerns I should consider for your training plan?"
  ]
}
```

## Step 2: Providing Follow-up Information

When you receive an `incomplete_profile` status, send another request that:

1. Provides answers to the follow-up questions
2. Includes the previous conversation history

```json
{
  "user_input": "I have a background in CrossFit from 2 years ago and I occasionally have knee pain.",
  "conversation_history": [
    {
      "role": "user",
      "content": "I want to start a hybrid training program. I'm a runner who does 20 miles per week. I have access to a gym with all equipment and can train Monday, Wednesday, Friday evenings and weekends. My goal is to improve my half marathon time while building some muscle."
    },
    {
      "role": "assistant",
      "content": "Can you tell me about your fitness background and any health concerns I should consider for your training plan?"
    }
  ],
  "plan_parameters": {
    "duration_weeks": 4,
    "emphasis": "balanced"
  }
}
```

## Step 3: Receiving the Complete Plan

When all required information has been provided, the API will return a complete plan:

```json
{
  "status": "complete",
  "profile_data": {
    "training_history": "Runs 20 miles per week",
    "fitness_background": "CrossFit 2 years ago",
    "weekly_schedule": "Available Monday, Wednesday, Friday evenings and weekends",
    "available_equipment": "Full gym access",
    "training_goals": "Improve half marathon time and build muscle",
    "health_constraints": "Occasional knee pain"
  },
  "missing_fields": [],
  "follow_up_questions": [],
  "plan": {
    "title": "4-Week Hybrid Training Plan",
    "description": "A balanced training program focused on half marathon improvement and muscle building",
    "weeks": [
      // Week details here
    ]
  },
  "recommendations": [
    "Consider knee support during longer runs",
    "Focus on proper form during squats to protect knee joints"
  ],
  "guidelines": "Here's a 4-week plan tailored to your background as a runner with CrossFit experience..."
}
```

## Important Notes

1. **Conversation History**: Always include the full conversation history in follow-up requests to maintain context
2. **Plan Parameters**: Keep plan parameters consistent throughout the conversation
3. **Guidelines Field**: The `guidelines` field contains a conversational overview of the plan that's user-friendly
4. **Plan Field**: The `plan` object contains the structured training plan data

## Error Handling

The API will return standard HTTP error codes:

- **401**: Invalid or missing API key
- **500**: Server-side processing error

Always check the response status code and handle errors appropriately.
