import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const routes = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    path: '/create-plan',
    label: 'Training Guidance',
    icon: MessageSquare
  }
];

export function Sidebar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="hidden lg:block w-64 border-r fixed h-full bg-card">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary">Hybrid Toolbox</h2>
        </div>

        <div className="px-3 py-2">
          <div className="space-y-1">
            {routes.map(route => (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ${
                    isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                  }`
                }
              >
                <route.icon className="h-4 w-4" />
                <span>{route.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
              <AvatarFallback>
                {user?.name?.split(' ').map(n => n[0]).join('') || user?.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2" 
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}