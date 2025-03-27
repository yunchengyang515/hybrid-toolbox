import React from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { getCurrentPlan } from '@/lib/chat';
import { TrainingPlan } from '@/types/chat';
import { Button } from '@/components/ui/button';

export default function PlanView() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [plan, setPlan] = React.useState<TrainingPlan | null>(null);

  React.useEffect(() => {
    if (user) {
      getCurrentPlan(user.id).then(setPlan);
    }
  }, [user]);

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading your plan...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate('/chat')}
          variant="ghost"
          className="mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Chat
        </Button>

        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Weekly Plan Preview</h1>
          </div>

          <div className="space-y-4">
            {plan.weeklySchedule.map((day, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  day.session.type === 'run'
                    ? 'bg-blue-50 border-blue-200'
                    : day.session.type === 'strength'
                    ? 'bg-purple-50 border-purple-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">{day.day}</span>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      day.session.type === 'run'
                        ? 'bg-blue-100 text-blue-800'
                        : day.session.type === 'strength'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {day.session.activity}
                    </span>
                    {day.session.duration && (
                      <span className="text-sm text-gray-500 mt-1">
                        {day.session.duration}
                      </span>
                    )}
                    {day.session.details && (
                      <span className="text-sm text-gray-500 mt-1">
                        {day.session.details}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg border">
            <p className="text-sm text-muted-foreground">
              This is a preview of your personalized plan based on our conversation.
              The plan combines running and strength training to help you achieve your goals
              while maintaining balance and preventing burnout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}