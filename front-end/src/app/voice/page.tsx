
import VoiceClient from '@/components/features/voice/voice-client';
import AuthGuard from '@/components/auth/auth-guard';

export const metadata = {
    title: 'Voice Assistant - Kisan Saathi',
    description: 'Ask any agriculture related question using your voice.',
};

export default function VoicePage() {
    return (
        <AuthGuard>
            <VoiceClient />
        </AuthGuard>
    );
}
