'use client';

import {
  BotMessageSquare,
  Home,
  Landmark,
  Stethoscope,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/disease-detection', icon: Stethoscope, label: 'Diagnose' },
  { href: '/chat', icon: BotMessageSquare, label: 'Chat', isNew: true },
  { href: '/schemes', icon: Landmark, label: 'Schemes' },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-card/95 backdrop-blur-sm border-t md:hidden">
      <div className="grid h-full grid-cols-4">
        {navItems.map((item) => {
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-sm font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              <div className="relative">
                <item.icon className="h-6 w-6" />
                {item.isNew && (
                  <Badge variant="destructive" className="absolute -top-1 -right-3 text-[10px] p-0.5 h-auto leading-none">
                    NEW
                  </Badge>
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
