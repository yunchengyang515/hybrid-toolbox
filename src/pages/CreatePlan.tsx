import React, { useState } from 'react';
import { Send, Info } from 'lucide-react';
import { Message } from '@/types/chat';
import { sendChatMessage } from '@/lib/chat';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth';
import { Card, CardContent } from '@/components/ui/card';

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  type: 'assistant',
  content:
    "Hi! I'm your AI training assistant. Tell me about your fitness goals and experience, and I'll provide personalized guidance on combining running and strength training effectively.",
  timestamp: new Date(),
};

export default function CreatePlan() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create conversation history from previous messages
      const conversationHistory = messages
        .filter(msg => msg.id !== 'welcome') // Skip the welcome message
        .map(msg => ({
          role: msg.type,
          content: msg.content,
        }));

      // Call the serverless function
      const response = await sendChatMessage(input.trim(), conversationHistory);

      // Add AI response to messages
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.message || "I've processed your request.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Log the plan data for debugging
      if (response.plan) {
        console.log('Plan received:', response.plan);
      }

      // Log the status for debugging
      if (response.status) {
        console.log('Response status:', response.status);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'assistant',
          content: "I apologize, but I'm having trouble processing your request. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)] my-4">
      <div className="h-full bg-card rounded-lg shadow-lg flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">Training Guidance</h1>
          <p className="text-sm text-muted-foreground">
            Get personalized guidance on combining running and strength training
          </p>
        </div>

        <Card className="m-4 bg-blue-50 border-blue-100">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-blue-800">
                  Our AI assistant provides personalized guidance and recommendations based on your
                  goals and experience. Share your fitness goals, current routine, and preferences
                  to receive expert advice on:
                </p>
                <ul className="text-sm text-blue-800 mt-2 list-disc list-inside">
                  <li>Balancing running and strength training</li>
                  <li>Training frequency and intensity</li>
                  <li>Recovery and progression strategies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="mt-1">
                  {message.type === 'user' ? (
                    <>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                      />
                      <AvatarFallback>
                        {user?.name
                          ?.split(' ')
                          .map(n => n[0])
                          .join('') || user?.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=hybrid-toolbox" />
                      <AvatarFallback>AI</AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t p-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder="Ask about training, recovery, or progression..."
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading} size="icon" aria-label="Send message">
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
