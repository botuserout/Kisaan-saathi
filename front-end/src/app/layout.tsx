import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import BottomNavigation from '@/components/shared/bottom-navigation';
import { cn } from '@/lib/utils';
import ClientI18nProvider from '@/components/shared/client-i18n-provider';
import { AuthProvider } from '@/components/auth/auth-provider';


export const metadata: Metadata = {
  title: 'Krishi Sakhi - AI Farming Assistant',
  description: 'AI-Powered Personal Farming Assistant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen')} suppressHydrationWarning={true}>
        <AuthProvider>
          <ClientI18nProvider>
            <div className="relative flex flex-col min-h-screen">
              <main className="flex-grow pb-24 px-4 pt-8">
                <div className="max-w-4xl mx-auto w-full">{children}</div>
              </main>
              <BottomNavigation />
            </div>
            <Toaster />
          </ClientI18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
