import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Dumbbell, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
          <nav className="h-full flex flex-col bg-card pt-16">
            <SidebarContent />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex h-screen w-64 flex-col bg-card border-r">
        <SidebarContent />
      </nav>
    </>
  );
}

function SidebarContent() {
  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
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
    </div>
  );
}
