
import { auth } from '@/lib/firebase';
import { api } from '@/lib/api';

export interface VoiceResponse {
    transcript?: string;
    reply?: string;
    audioUrl?: string;
    action?: string;
}

export async function processVoiceAudio(audioBlob: Blob): Promise<VoiceResponse> {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('Not authenticated');

    // Convert Blob to File/Base64 if needed, or send as FormData
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    // formData.append('token', token); // api wrapper handles token in header usually, but if using custom fetch...

    // We'll use our api wrapper but we need to handle FormData
    // The api wrapper I created supports 'data' as JSON.
    // I might need to use raw fetch for FormData or update api wrapper.
    // For now, let's use the api wrapper's token logic but construct fetch manually if wrapper is strict.
    // Checking api.ts... it strings 'data'.
    // So I'll use a direct fetch with the token helper if accessible or just raw code here.

    // Implementation using raw fetch to support FormData
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    const res = await fetch(`${API_URL}/voice/process`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (!res.ok) {
        throw new Error('Voice processing failed');
    }

    return res.json();
}
