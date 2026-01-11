import ChatClient from '@/components/features/chat/chat-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat Assistant | Kisan Saathi',
  description: 'AI-powered farming assistant chat',
};

// Force dynamic rendering to prevent static export errors
export const dynamic = 'force-dynamic';

export default function ChatPage() {
  return <ChatClient />;
}
