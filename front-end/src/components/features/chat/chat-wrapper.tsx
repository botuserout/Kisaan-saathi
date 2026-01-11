"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the ChatClient with SSR disabled
// This ensures the component only renders on the client side, avoiding build-time errors
const ChatClient = dynamic(
    () => import('./chat-client'),
    {
        ssr: false,
        loading: () => <div className="p-4 text-center">Loading chat assistant...</div>
    }
);

export default function ChatWrapper() {
    return (
        <Suspense fallback={<div className="p-4 text-center">Initializing...</div>}>
            <ChatClient />
        </Suspense>
    );
}
