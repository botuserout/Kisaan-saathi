"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Loader2, Volume2, StopCircle, ArrowLeft } from 'lucide-react';
import { useVoiceAssistant } from '@/hooks/use-voice-assistant';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function VoiceClient() {
    const { t, i18n } = useTranslation();
    const router = useRouter();

    // Helper to map app language to speech language
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
            <div className="flex flex-col h-full min-h-[80vh] items-center justify-center p-6 text-center">
                <Button
                    variant="ghost"
                    className="absolute top-4 left-4"
                    onClick={() => router.push('/')}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('back', 'Back')}
                </Button>
                <h2 className="text-xl font-bold text-destructive mb-2">Voice Not Supported</h2>
                <p>Your browser doesn't support the required speech features.</p>
                <p className="text-sm text-muted-foreground mt-2">Try using Google Chrome.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full min-h-[80vh] items-center justify-center p-4 relative">
            {/* Back Button */}
            <Button
                variant="ghost"
                className="absolute top-4 left-4"
                onClick={() => router.push('/')}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> {t('back', 'Back')}
            </Button>

            <div className="w-full max-w-lg flex flex-col items-center justify-center space-y-8">

                {/* Status Text */}
                <div className="min-h-[3rem] text-center">
                    {state === 'IDLE' && (
                        <p className="text-2xl font-medium text-muted-foreground">{t('tap_to_speak', 'Tap to Ask')}</p>
                    )}
                    {state === 'LISTENING' && (
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-xl text-primary font-bold animate-pulse">{t('listening', 'Listening...')}</p>
                            <div className="flex gap-1 h-4 items-center">
                                <div className="w-1.5 h-full bg-primary animate-[pulse_0.5s_ease-in-out_infinite]"></div>
                                <div className="w-1.5 h-2/3 bg-primary animate-[pulse_0.5s_ease-in-out_infinite_0.1s]"></div>
                                <div className="w-1.5 h-full bg-primary animate-[pulse_0.5s_ease-in-out_infinite_0.2s]"></div>
                            </div>
                        </div>
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
                    {/* Visual Glow Effect */}
                    <div className={cn(
                        "absolute inset-0 rounded-full blur-2xl transition-all duration-500",
                        state === 'LISTENING' ? "bg-red-500/40 scale-150 opacity-100" :
                            state === 'SPEAKING' ? "bg-green-500/40 scale-125 opacity-100" :
                                "bg-primary/20 scale-100 opacity-0"
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
                            <Loader2 className="h-14 w-14 text-white animate-spin" />
                        ) : state === 'SPEAKING' ? (
                            <Volume2 className="h-14 w-14 text-white animate-pulse" />
                        ) : isActive ? (
                            <StopCircle className="h-14 w-14 text-white" />
                        ) : (
                            <Mic className="h-14 w-14 text-white" />
                        )}
                    </Button>
                </div>

                {/* Transcript / Result Card */}
                <div className={cn(
                    "w-full transition-all duration-500 overflow-hidden px-4",
                    transcript || state !== 'IDLE' ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
                )}>
                    {transcript && (
                        <Card className="border-none shadow-sm bg-muted/50">
                            <CardContent className="p-6 text-center">
                                <p className="text-lg font-medium leading-relaxed text-foreground/90">"{transcript}"</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

            </div>
        </div>
    );
}
