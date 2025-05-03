import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Info, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-muted-foreground mt-1">
            Get personalized training guidance tailored to your goals
          </p>
        </div>
        <Button onClick={() => navigate('/create-plan')} className="gap-2">
          <MessageSquare className="w-4 h-4" />
          Get Training Guidance
        </Button>
      </div>

      <div className="mb-6">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">How It Works</h2>
                <p className="text-muted-foreground">
                  Chat with our AI assistant to receive personalized training guidelines based on your goals, 
                  experience, and preferences. Our AI will help you understand the best approach to combine 
                  running and strength training effectively.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Training Guidance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                ✓ Personalized training recommendations
              </li>
              <li className="flex items-center gap-2">
                ✓ Goal-specific guidance
              </li>
              <li className="flex items-center gap-2">
                ✓ Hybrid training principles
              </li>
            </ul>
            <Button onClick={() => navigate('/create-plan')} className="w-full">
              Get Started
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Premium Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground mb-6">
              <li className="flex items-center gap-2 opacity-60">
                • Detailed weekly training plans
              </li>
              <li className="flex items-center gap-2 opacity-60">
                • Progress tracking dashboard
              </li>
              <li className="flex items-center gap-2 opacity-60">
                • Advanced analytics
              </li>
            </ul>
            <Button variant="outline" disabled className="w-full">
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}