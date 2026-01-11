"use client";

import { useEffect, useState } from 'react';
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Loader2, Volume2, StopCircle, X } from 'lucide-react';
import { useVoiceAssistant } from '@/hooks/use-voice-assistant';
import { useTranslation } from 'react-i18next';
import AuthGuard from '@/components/auth/auth-guard';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function VoiceAssistantPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();


  // Determine the language code logic
  const getLocale = (lang: string) => {
    const map: Record<string, string> = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'gu': 'gu-IN',
      'or': 'or-IN',
      'bho': 'hi-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN'
    };
    return map[lang] || 'en-IN';
  };

  const {
    state,
    transcript,
    error,
    startListening,
    stopAudio,
    isSupported
  } = useVoiceAssistant({
    language: getLocale(i18n.language)
  });

  const isActive = state !== 'IDLE';

  // Fallback if browser doesn't support Web Speech API
  if (!isSupported) {
    return (
      <AuthGuard>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
          <h2 className="text-xl font-bold text-destructive mb-2">Voice Not Supported</h2>
          <p>Your browser doesn't support the required speech features.</p>
          <p className="text-sm text-muted-foreground mt-2">Try using Google Chrome.</p>
          <Button className="mt-6" onClick={() => router.push('/')}>Go Back</Button>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex flex-col h-[calc(100vh-80px)] items-center">
        <PageHeader title={t('voice_assistant', 'Voice Assistant')} />

        <div className="flex-1 w-full max-w-lg flex flex-col items-center justify-center p-6 space-y-8">

          {/* Status Text */}
          <div className="min-h-[3rem] text-center">
            {state === 'IDLE' && (
              <p className="text-xl text-muted-foreground">{t('tap_to_speak', 'Tap the mic to speak')}</p>
            )}
            {state === 'LISTENING' && (
              <p className="text-xl text-primary font-medium animate-pulse">{t('listening', 'Listening...')}</p>
            )}
            {state === 'PROCESSING' && (
              <p className="text-xl text-amber-500 font-medium">{t('processing', 'Thinking...')}</p>
            )}
            {state === 'SPEAKING' && (
              <p className="text-xl text-green-600 font-medium flex items-center justify-center gap-2">
                <Volume2 className="h-5 w-5" />
                {t('speaking', 'Speaking...')}
              </p>
            )}
            {state === 'ERROR' && (
              <p className="text-xl text-red-500 font-medium">{error || t('error')}</p>
            )}
          </div>

          {/* Main Mic Button */}
          <div className="relative group">
            {/* Ripple/Glow effect */}
            <div className={cn(
              "absolute inset-0 rounded-full blur-xl transition-all duration-500",
              state === 'LISTENING' ? "bg-red-500/30 scale-150" :
                state === 'SPEAKING' ? "bg-green-500/30 scale-125" :
                  "bg-primary/10 scale-100"
            )} />

            <Button
              size="icon"
              className={cn(
                "w-32 h-32 rounded-full shadow-2xl transition-all duration-300 relative z-10 border-4",
                state === 'LISTENING' ? "bg-red-500 hover:bg-red-600 border-red-200" :
                  state === 'PROCESSING' ? "bg-amber-500 hover:bg-amber-600 border-amber-200" :
                    state === 'SPEAKING' ? "bg-green-500 hover:bg-green-600 border-green-200" :
                      "bg-primary hover:bg-primary/90 border-transparent"
              )}
              onClick={isActive ? stopAudio : startListening}
            >
              {state === 'PROCESSING' ? (
                <Loader2 className="h-16 w-16 text-white animate-spin" />
              ) : state === 'SPEAKING' ? (
                <Volume2 className="h-16 w-16 text-white animate-pulse" />
              ) : isActive ? (
                <StopCircle className="h-16 w-16 text-white" />
              ) : (
                <Mic className="h-16 w-16 text-white" />
              )}
            </Button>
          </div>

          {/* Transcript / Result Card */}
          <Card className={cn(
            "w-full transition-all duration-500 overflow-hidden",
            transcript || state !== 'IDLE' ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
          )}>
            <CardContent className="p-6 text-center min-h-[100px] flex items-center justify-center border-t-4 border-primary/20">
              {transcript ? (
                <p className="text-lg font-medium leading-relaxed">"{transcript}"</p>
              ) : (
                <div className="flex gap-2">
                  <span className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce delay-75" />
                  <span className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce delay-150" />
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </AuthGuard>
  );
}
