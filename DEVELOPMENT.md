# Hybrid Toolbox Development Guide

## Project Overview

Hybrid Toolbox is a React-based web application that provides personalized fitness plans combining running and strength training. The application uses:

- React with TypeScript
- Tailwind CSS for styling
- shadcn/ui for UI components
- Supabase for authentication and data storage
- Netlify Functions for serverless backend

## Architecture

The project follows Clean Architecture principles with a clear separation of concerns:

```
src/
├── components/     # Reusable UI components
├── lib/           # Core business logic and utilities
├── pages/         # Page components and routing
├── store/         # Global state management
├── types/         # TypeScript type definitions
└── config/        # Application configuration
```

### SOLID Principles Implementation

1. **Single Responsibility Principle**
   - Each component handles one specific concern
   - Services are separated into distinct modules (auth, chat, plan)
   - UI components are decoupled from business logic

2. **Open/Closed Principle**
   - Abstract interfaces for services allow extending functionality
   - Theme system is extensible without modifying core code
   - Message handling system can be extended with new types

3. **Liskov Substitution Principle**
   - Components use TypeScript interfaces for consistent behavior
   - Service implementations can be swapped without breaking the app

4. **Interface Segregation Principle**
   - Small, focused interfaces for different features
   - Components only depend on interfaces they use

5. **Dependency Inversion Principle**
   - High-level modules depend on abstractions
   - Services are injected rather than directly instantiated

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Customization Guide

### Replacing the Chat Backend

The chat system is designed to be easily replaceable. To implement your own chat backend:

1. Create a new service implementing the `ChatService` interface:

```typescript
interface ChatService {
  sendMessage(message: string): Promise<ChatResponse>;
  getCurrentPlan(userId: string): Promise<TrainingPlan>;
}
```

2. Update the service configuration in `src/lib/chat.ts`

### Integrating Supabase

1. Click "Connect to Supabase" in the top right
2. Update authentication configuration in `src/lib/supabase.ts`
3. Create necessary database tables using migration files

### Implementing Your Own RAG System

The Retrieval-Augmented Generation system can be customized:

1. Create embeddings service:
```typescript
interface EmbeddingsService {
  generateEmbeddings(text: string): Promise<number[]>;
  findSimilar(embedding: number[]): Promise<string[]>;
}
```

2. Implement vector storage in Supabase or alternative
3. Update the chat service to use your RAG implementation

### Adding an MCP (Model Control Protocol)

To implement your own model control:

1. Create an MCP service:
```typescript
interface MCPService {
  validateResponse(response: string): Promise<boolean>;
  enforceGuidelines(message: string): Promise<string>;
}
```

2. Integrate with the chat service
3. Add necessary middleware in Netlify Functions

## Testing

- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`
- Component tests: `npm run test:components`

## Deployment

1. Configure Netlify:
   ```bash
   npm run netlify:dev # For local testing
   ```

2. Deploy:
   - Push to main branch for automatic deployment
   - Manual deploy: `npm run deploy`

## Best Practices

1. **State Management**
   - Use Zustand for global state
   - Keep component state local when possible
   - Implement proper state hydration

2. **Performance**
   - Lazy load routes and heavy components
   - Implement proper memoization
   - Use proper key props in lists

3. **Security**
   - Implement proper CORS headers
   - Validate all user input
   - Use proper authentication checks

4. **Error Handling**
   - Implement proper error boundaries
   - Log errors appropriately
   - Provide user-friendly error messages

