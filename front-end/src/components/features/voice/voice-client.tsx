
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Loader2, Volume2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { processVoiceAudio } from './voice-service';

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export default function VoiceClient() {
    const router = useRouter();
    const [state, setState] = useState<VoiceState>('idle');
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startListening = async () => {
        try {
            setState('listening');
            setTranscript('');
            setResponse('');
            setError('');

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                await handleAudioProcess(audioBlob);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
        } catch (err) {
            console.error(err);
            setError('Microphone access denied or not available.');
            setState('error');
        }
    };

    const stopListening = () => {
        if (mediaRecorderRef.current && state === 'listening') {
            mediaRecorderRef.current.stop();
            setState('processing');
        }
    };

    const handleAudioProcess = async (blob: Blob) => {
        try {
            // Mocking the flow for now as backend might not be fully ready with real STT
            // In real implementation:
            // const result = await processVoiceAudio(blob);

            // Simulating API delay
            setTimeout(() => {
                setTranscript("How much fertilizer should I use for wheat?");
                setResponse("For wheat, it is recommended to use 120kg of Nitrogen per hectare, split into 3 doses.");
                setState('speaking');
            }, 2000);

            // Real Call (Uncomment when backend is ready)
            /*
            const result = await processVoiceAudio(blob);
            setTranscript(result.transcript || '');
            setResponse(result.reply || '');
            setState('speaking');
            */

        } catch (err) {
            setError('Failed to process voice. Please try again.');
            setState('error');
        }
    };

    return (
        <div className="flex flex-col h-full min-h-[80vh] items-center justify-center p-4">
            <Button
                variant="ghost"
                className="absolute top-4 left-4"
                onClick={() => router.push('/')}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <div className="w-full max-w-md space-y-8 text-center">

                {/* Status Display */}
                <div className="min-h-[100px] flex items-end justify-center pb-4">
                    {state === 'idle' && <p className="text-xl text-muted-foreground font-medium">Tap to Ask</p>}
                    {state === 'listening' && <div className="flex gap-1 h-8 items-center">
                        <span className="w-2 h-full bg-primary animate-[pulse_0.5s_ease-in-out_infinite]"></span>
                        <span className="w-2 h-2/3 bg-primary animate-[pulse_0.5s_ease-in-out_infinite_0.1s]"></span>
                        <span className="w-2 h-full bg-primary animate-[pulse_0.5s_ease-in-out_infinite_0.2s]"></span>
                        <span className="w-2 h-1/2 bg-primary animate-[pulse_0.5s_ease-in-out_infinite_0.3s]"></span>
                    </div>}
                    {state === 'processing' && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
                    {state === 'error' && <p className="text-destructive font-medium">{error}</p>}
                </div>

                {/* Mic Button */}
                <div className="relative group">
                    <div className={cn(
                        "absolute inset-0 bg-primary/20 rounded-full blur-2xl transition-all duration-500",
                        state === 'listening' ? "scale-150 opacity-100" : "scale-100 opacity-0"
                    )} />

                    <Button
                        size="icon"
                        className={cn(
                            "w-32 h-32 rounded-full shadow-xl transition-all duration-300 relative z-10",
                            state === 'listening' ? "bg-red-500 hover:bg-red-600 scale-110" : "bg-primary hover:bg-primary/90"
                        )}
                        onClick={state === 'listening' ? stopListening : startListening}
                        disabled={state === 'processing'}
                    >
                        {state === 'processing' ? (
                            <Loader2 className="h-12 w-12 animate-spin" />
                        ) : (
                            <Mic className={cn("h-12 w-12", state === 'listening' && "animate-pulse")} />
                        )}
                    </Button>
                </div>

                {/* Interaction Text */}
                <div className="space-y-4 px-4 min-h-[150px]">
                    {transcript && (
                        <div className="text-lg font-medium text-foreground/80">
                            "{transcript}"
                        </div>
                    )}

                    {response && (
                        <Card className="bg-muted/50 border-none shadow-sm animate-in slide-in-from-bottom-5">
                            <CardContent className="p-6 text-left flex gap-4">
                                <div className="shrink-0 mt-1">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Volume2 className="h-4 w-4 text-primary" />
                                    </div>
                                </div>
                                <p className="text-lg leading-relaxed text-foreground">
                                    {response}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

            </div>
        </div>
    );
}
