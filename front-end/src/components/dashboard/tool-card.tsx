import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';

type ToolCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export default function ToolCard({
  title,
  description,
  href,
  icon: Icon,
}: ToolCardProps) {
  return (
    <Link href={href} className="group">
      <Card className="rounded-2xl h-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50">
        <CardContent className="p-4 md:p-6 flex flex-col items-start gap-3">
          <div className="bg-accent text-accent-foreground p-3 rounded-full">
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm md:text-base text-foreground/90">{title}</h3>
            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
