import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic } from 'lucide-react';

export default function VoiceAssistantPage() {
  return (
    <div className="flex flex-col items-center text-center">
      <PageHeader title="AI Voice Assistant" />
      <Card className="w-full max-w-md rounded-2xl mt-8">
        <CardContent className="p-8 space-y-6 flex flex-col items-center">
          <p className="text-muted-foreground">Tap the button and speak your query.</p>
          <Button
            size="icon"
            className="w-24 h-24 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          >
            <Mic className="h-12 w-12" />
          </Button>
          <p className="text-sm text-muted-foreground animate-pulse">Listening...</p>
        </CardContent>
      </Card>
    </div>
  );
}
