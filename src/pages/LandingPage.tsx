import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Activity, Target, Users, Clock, Shield } from 'lucide-react';
import { APP_CONFIG } from '../config/app';
import { useAuthStore } from '../store/auth';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const features = [
  {
    icon: Target,
    title: 'Personalized Goals',
    description: 'Training plans adapted to your specific fitness objectives and lifestyle.'
  },
  {
    icon: Users,
    title: 'AI Coaching',
    description: 'Get guidance from our AI coach that understands your unique needs.'
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'Balance your running and strength training on your terms.'
  },
  {
    icon: Shield,
    title: 'Science-Backed',
    description: 'Training principles based on proven exercise science.'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { initMockSession } = useAuthStore();

  const handleStart = () => {
    initMockSession();
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-4 mb-6">
            <Activity className="w-12 h-12 text-indigo-600" />
            <Dumbbell className="w-12 h-12 text-purple-600" />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {APP_CONFIG.name}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            {APP_CONFIG.description}
          </p>
          
          <p className="text-lg text-gray-700 mb-12">
            Create your personalized hybrid training plan through a natural conversation with our AI coach. 
            Combine running and strength training in a way that works for your goals and lifestyle.
          </p>
          
          <Button
            onClick={handleStart}
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-lg shadow-lg"
          >
            Start Your Journey
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Hybrid Toolbox?
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg">
              <CardHeader>
                <feature.icon className="w-10 h-10 text-indigo-600 mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto px-4 py-16 bg-white rounded-3xl shadow-sm">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Values</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-indigo-600 mb-3">Balance is Key</h3>
              <p className="text-gray-600">
                We believe in the power of combining different training modalities to achieve optimal results.
                Running builds endurance, strength training builds power – together, they create a complete athlete.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-indigo-600 mb-3">Personalization Matters</h3>
              <p className="text-gray-600">
                No two athletes are the same. Your training plan should reflect your unique goals, 
                schedule, and preferences. Our AI coach adapts to you, not the other way around.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-indigo-600 mb-3">Sustainable Progress</h3>
              <p className="text-gray-600">
                We focus on creating sustainable, long-term habits rather than quick fixes. 
                Your journey to better fitness should be enjoyable and maintainable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}