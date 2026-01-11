"use client";

import React from 'react';
import { Mic, X, Loader2, Volume2, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceAssistant } from '@/hooks/use-voice-assistant';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface VoiceAssistantProps {
    language?: string;
    onResponse?: (text: string) => void;
}

const LANG_MAP: Record<string, string> = {
    'en': 'en-IN',
    'hi': 'hi-IN',
    'gu': 'gu-IN',
    'or': 'or-IN',
    'bho': 'hi-IN',
    'kn': 'kn-IN',
    'ml': 'ml-IN'
};

export default function VoiceAssistant({ language = 'en', onResponse }: VoiceAssistantProps) {
    const { t } = useTranslation();
    const locale = LANG_MAP[language] || 'en-IN';

    const {
        state,
        transcript,
        error,
        startListening,
        stopAudio,
        isSupported
    } = useVoiceAssistant({
        language: locale,
        onResponse
    });

    if (!isSupported) return null;

    const isActive = state !== 'IDLE';

    // Helper text based on state
    const getStatusText = () => {
        switch (state) {
            case 'LISTENING': return t('listening', 'Listening...');
            case 'PROCESSING': return t('processing', 'Thinking...');
            case 'SPEAKING': return t('speaking', 'Speaking...');
            case 'ERROR': return error || t('error', 'Error');
            default: return '';
        }
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
            {/* Transcript / Status Bubble */}
            <div className={cn(
                "bg-white dark:bg-zinc-900 border shadow-xl rounded-2xl p-4 max-w-xs w-64 pointer-events-auto transition-all duration-300 origin-bottom-right",
                isActive ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none h-0 p-0 overflow-hidden border-0"
            )}>
                <div className="flex justify-between items-center mb-2">
                    <span className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        state === 'ERROR' ? "text-red-500" : "text-primary"
                    )}>
                        {getStatusText()}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={stopAudio}>
                        <X className="h-3 w-3" />
                    </Button>
                </div>

                <p className="text-sm font-medium text-foreground min-h-[1.5em] break-words">
                    {transcript || (state === 'SPEAKING' ? "..." : "")}
                </p>

                {state === 'LISTENING' && (
                    <div className="mt-3 flex gap-1 justify-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></div>
                    </div>
                )}
            </div>

            {/* Main Mic Button */}
            <Button
                size="icon"
                className={cn(
                    "h-16 w-16 rounded-full shadow-2xl pointer-events-auto transition-all duration-500 border-4",
                    state === 'LISTENING' ? "bg-red-500 hover:bg-red-600 border-red-200 animate-pulse" :
                        state === 'PROCESSING' ? "bg-amber-500 hover:bg-amber-600 border-amber-200" :
                            state === 'SPEAKING' ? "bg-green-500 hover:bg-green-600 border-green-200 ring-4 ring-green-100 dark:ring-green-900" :
                                "bg-primary hover:bg-primary/90 border-transparent"
                )}
                onClick={isActive ? stopAudio : startListening}
            >
                {state === 'PROCESSING' ? (
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                ) : state === 'SPEAKING' ? (
                    <Volume2 className="h-8 w-8 text-white animate-pulse" />
                ) : isActive ? (
                    <StopCircle className="h-8 w-8 text-white" />
                ) : (
                    <Mic className="h-8 w-8 text-white" />
                )}
            </Button>
        </div>
    );
}
