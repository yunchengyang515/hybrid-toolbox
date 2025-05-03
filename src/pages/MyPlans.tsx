import React from 'react';
import { Calendar, Plus, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { getCurrentPlan } from '@/lib/chat';
import { TrainingPlan } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function MyPlans() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activePlan, setActivePlan] = React.useState<TrainingPlan | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      getCurrentPlan(user.id)
        .then(setActivePlan)
        .catch(err => {
          console.error('Error fetching plan:', err);
          setError('Unable to load your training plan. Please try again later.');
        });
    }
  }, [user]);

  if (error) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="bg-card rounded-xl shadow-lg p-6">
          <p className="text-destructive">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Training Plans</h1>
          <Button onClick={() => navigate('/create-plan')} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Plan
          </Button>
        </div>

        {!activePlan ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Active Plan</h2>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                You don't have any active training plans. Create your first personalized plan to get started!
              </p>
              <Button onClick={() => navigate('/create-plan')}>Create Your First Plan</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Current Training Plan
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Plan viewing functionality will be available in a future update
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activePlan.weeklySchedule.map((day, index) => (
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Previous Plans</CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Previous plans viewing will be available in a future update
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  No previous plans found
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}