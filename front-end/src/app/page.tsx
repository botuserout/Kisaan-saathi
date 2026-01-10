'use client';

import DashboardHeader from '@/components/dashboard/header';
import WeatherCard from '@/components/dashboard/weather-card';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Camera, Bell, Volume2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-[80vh] space-y-6">
      <DashboardHeader />
      <WeatherCard />

      <main className="flex-1 flex flex-col gap-6">
        {/* Primary Action: ASK */}
        <Link href="/voice" className="flex-1 min-h-[220px]">
          <Card className="h-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors border-0 shadow-xl relative overflow-hidden group">
            <CardContent className="h-full flex flex-col items-center justify-center gap-6 p-8 relative z-10">
              <div className="p-8 bg-white/20 rounded-full group-hover:scale-105 transition-transform shadow-inner border-2 border-white/30 relative">
                {/* Pulse Effect */}
                <div className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-50" />
                <Mic className="h-16 w-16 md:h-20 md:w-20 text-white fill-white/20" strokeWidth={1.5} />
              </div>
              <div className="text-center space-y-1">
                <span suppressHydrationWarning className="block text-4xl md:text-5xl font-bold tracking-wider text-white drop-shadow-sm">{t('ask_btn')}</span>
                <span className="block text-sm font-medium text-white/80 tracking-widest uppercase">Tap to Speak</span>
              </div>
              {/* Future Audio Output Indicator */}
              <div className="absolute top-6 right-6 opacity-60">
                <Volume2 className="h-6 w-6 text-white" />
              </div>
            </CardContent>
            {/* Decorative background circle */}
            <div className="absolute -right-16 -bottom-16 h-56 w-56 bg-white/10 rounded-full blur-3xl" />
          </Card>
        </Link>

        <div className="grid grid-cols-2 gap-6 h-[220px]">
          {/* Action: SCAN */}
          <Link href="/disease-detection" className="h-full">
            <Card className="h-full bg-emerald-100 dark:bg-emerald-950/50 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors border-0 shadow-lg">
              <CardContent className="h-full flex flex-col items-center justify-center gap-5 p-6">
                <div className="p-4 bg-emerald-200 dark:bg-emerald-900 rounded-full text-emerald-800 dark:text-emerald-100 shadow-sm">
                  <Camera className="h-10 w-10 md:h-12 md:w-12" strokeWidth={1.5} />
                </div>
                <span suppressHydrationWarning className="text-2xl md:text-3xl font-bold text-emerald-900 dark:text-emerald-100 tracking-wide">{t('scan_btn')}</span>
              </CardContent>
            </Card>
          </Link>

          {/* Action: ALERTS */}
          <Link href="/alerts" className="h-full">
            <Card className="h-full bg-orange-100 dark:bg-orange-950/50 hover:bg-orange-200 dark:hover:bg-orange-900 transition-colors border-0 shadow-lg">
              <CardContent className="h-full flex flex-col items-center justify-center gap-5 p-6">
                <div className="p-4 bg-orange-200 dark:bg-orange-900 rounded-full text-orange-800 dark:text-orange-100 shadow-sm">
                  <Bell className="h-10 w-10 md:h-12 md:w-12" strokeWidth={1.5} />
                </div>
                <span suppressHydrationWarning className="text-2xl md:text-3xl font-bold text-orange-900 dark:text-orange-100 tracking-wide">{t('alerts_btn')}</span>
              </CardContent>
            </Card>
          </Link>
        </div>

      </main>
    </div>
  );
}
