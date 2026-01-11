"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, Send } from 'lucide-react';
import PageHeader from '@/components/shared/page-header';
import VoiceAssistant from '@/components/shared/voice-assistant';
import { api } from '@/lib/api';

type Message = {
  role: 'user' | 'ai';
  content: string;
};

import AuthGuard from '@/components/auth/auth-guard';

import { useTranslation } from 'react-i18next';

export default function ChatClient() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  // Auth check moved to AuthGuard

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: t('chat_intro')
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update default message when language changes (optional optimization)
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'ai') {
        return [{ role: 'ai', content: t('chat_intro') }];
      }
      return prev;
    });
  }, [t]);

  const handleSend = async () => {
    // ...

    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Optimistic update done, now fetch response
      // Switched to internal Next.js API route to use Gemini directly
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query_text: userMessage,
          language: 'en' // Pass language if needed
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${res.status}`);
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.response_text }]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMessage = error.message || "Sorry, I'm having trouble connecting to the AI.";
      setMessages(prev => [...prev, { role: 'ai', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="flex flex-col h-[80vh]">
        <PageHeader title={t('chat_support')} />
        <div className="flex-grow flex flex-col rounded-2xl bg-card border overflow-hidden">
          <div className="flex-grow p-6 space-y-6 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'ai' && (
                  <Avatar>
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-accent-foreground'
                  }`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <Avatar>
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-2">
                <Avatar><AvatarFallback>AI</AvatarFallback></Avatar>
                <div className="bg-accent rounded-lg p-3">
                  <span className="typing-dot">...</span>
                </div>
              </div>
            )}
          </div>
          <div className="bg-card border-t p-4">
            <div className="relative">
              <Input
                placeholder={t('type_message')}
                className="pr-24"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
              />
              <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <VoiceAssistant language={i18n.language} />
    </AuthGuard>
  );
}
