"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

// --- Type Definitions for Web Speech API ---
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
}

// --- Voice Assistant Hook ---

export type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING' | 'ERROR';

interface UseVoiceAssistantProps {
    onResponse?: (text: string) => void;
    language?: string; // e.g., 'en-IN', 'hi-IN'
    endpoint?: string;
}

export function useVoiceAssistant({
    onResponse,
    language = 'en-IN',
    endpoint = '/api/chat'
}: UseVoiceAssistantProps = {}) {
    const [state, setState] = useState<VoiceState>('IDLE');
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    // Initialize Speech Synthesis
    useEffect(() => {
        if (typeof window !== 'undefined') {
            synthRef.current = window.speechSynthesis;
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (synthRef.current) synthRef.current.cancel();
            if (recognitionRef.current) recognitionRef.current.abort();
        };
    }, []);

    const speak = useCallback((text: string) => {
        if (!synthRef.current) return;

        // Cancel existing
        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => setState('SPEAKING');

        utterance.onend = () => {
            setState('IDLE');
        };

        utterance.onerror = (e) => {
            console.error("TTS Error:", e);
            setState('IDLE');
        };

        // Attempt to pick a good voice
        const voices = synthRef.current.getVoices();
        // Prefer Google voices or native ones matching the language
        const preferredVoice = voices.find(v => v.lang === language && v.name.includes('Google')) ||
            voices.find(v => v.lang === language);

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        synthRef.current.speak(utterance);

        // Safety fallback if onstart doesn't trigger
        if (state !== 'SPEAKING') setState('SPEAKING');
    }, [language, state]);

    const processQuery = useCallback(async (text: string) => {
        if (!text.trim() || text.length < 2) {
            speak("I didn't catch that. Please say it again.");
            return;
        }

        setState('PROCESSING');

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query_text: text,
                    language: language,
                    is_voice: true
                })
            });

            if (!res.ok) throw new Error("Failed to fetch response");

            const data = await res.json();
            const responseText = data.response_text || "Sorry, I didn't get a response.";

            if (onResponse) onResponse(responseText);

            speak(responseText);

        } catch (err) {
            console.error("AI Processing Error:", err);
            setError("Trouble connecting. Please try again.");
            setState('ERROR');

            setTimeout(() => setState('IDLE'), 3000);
        }
    }, [endpoint, language, onResponse, speak]);

    const startListening = useCallback(() => {
        if (state === 'LISTENING' || state === 'PROCESSING' || state === 'SPEAKING') {
            // If already active, stop everything
            if (synthRef.current) synthRef.current.cancel();
            if (recognitionRef.current) recognitionRef.current.abort();
            setState('IDLE');
            return;
        }

        setError(null);
        setTranscript('');

        const SpeechRecognitionVar = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognitionVar) {
            setError("Voice not supported.");
            setState('ERROR');
            return;
        }

        const recognition = new SpeechRecognitionVar();
        recognition.lang = language;
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {
            setState('LISTENING');
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let finalTrans = '';
            let interimTrans = ''; // Just to show what's happening

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTrans += event.results[i][0].transcript;
                } else {
                    interimTrans += event.results[i][0].transcript;
                }
            }

            const displayTrans = finalTrans || interimTrans;
            setTranscript(displayTrans);

            if (finalTrans) {
                recognition.stop();
                processQuery(finalTrans);
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error("Speech Error:", event.error);

            if (event.error === 'no-speech') {
                setState('IDLE');
                return;
            }

            if (event.error === 'not-allowed') {
                setError("Microphone access denied.");
            } else if (event.error === 'network') {
                setError("Network error. Check connection.");
            } else {
                setError("Listening error. Please try again.");
            }

            setState('ERROR');
            setTimeout(() => setState('IDLE'), 3000);
        };

        recognition.onend = () => {
            // If we simply stopped (e.g. silence) without processing, go back to IDLE
            // We check this by seeing if we are still in LISTENING state
            // If we are in PROCESSING, it means onresult handled it.
            setState(prev => prev === 'LISTENING' ? 'IDLE' : prev);
        };

        recognitionRef.current = recognition;
        recognition.start();

    }, [language, processQuery, state]);

    const stopAudio = useCallback(() => {
        if (synthRef.current) synthRef.current.cancel();
        if (recognitionRef.current) recognitionRef.current.abort();
        setState('IDLE');
    }, []);

    return {
        state,
        transcript,
        error,
        startListening,
        stopAudio,
        isSupported: typeof window !== 'undefined' && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    };
}
