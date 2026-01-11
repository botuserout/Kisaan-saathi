import ChatClient from '@/components/features/chat/chat-client';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Chat Assistant | Kisan Saathi',
  description: 'AI-powered farming assistant chat',
};

// Force dynamic rendering to prevent static export errors
export const dynamic = 'force-dynamic';

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading chat...</div>}>
      <ChatClient />
    </Suspense>
  );
}
