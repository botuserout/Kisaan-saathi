'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                // Redirect to login, but remember where we were trying to go
                const params = new URLSearchParams();
                params.set('redirect', pathname);
                router.push(`/login?${params.toString()}`);
            } else {
                setUser(currentUser);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router, pathname]);

    if (loading) {
        return (
            <div className="flex flex-col space-y-4 p-4 h-[80vh] items-center justify-center">
                <div className="space-y-2 text-center">
                    <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                    <Skeleton className="h-4 w-[200px]" />
                    <p className="text-muted-foreground text-sm animate-pulse">Verifying access...</p>
                </div>
            </div>
        );
    }

    // Only render children if we have a user
    // (The useEffect handles the redirect if not)
    if (!user) return null;

    return <>{children}</>;
}
