import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Dumbbell, Menu, User, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuthStore } from '@/store/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const routes = [
  {
    path: '/chat',
    label: 'Chat',
    icon: MessageSquare,
  },
  {
    path: '/plan',
    label: 'Plan',
    icon: Dumbbell,
    beta: true,
  },
];

export function Sidebar() {
  return (
    <>
      {/* Mobile Trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <button className="lg:hidden fixed left-4 top-4 p-2 rounded-lg bg-primary text-primary-foreground">
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <nav className="h-full flex flex-col bg-card">
            <SidebarContent />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:block w-64 border-r fixed h-full bg-card">
        <SidebarContent />
      </nav>
    </>
  );
}

function SidebarContent() {
  const { user, logout } = useAuthStore();

  return (
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
              {route.beta && (
                <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                  Beta
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
            <AvatarFallback>
              {user?.name
                ?.split(' ')
                .map(n => n[0])
                .join('') || user?.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => logout()}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
