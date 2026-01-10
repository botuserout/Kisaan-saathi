'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type PageHeaderProps = {
  title: string;
};

export default function PageHeader({ title }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 mb-6">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10"
        onClick={() => router.back()}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Back</span>
      </Button>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}
