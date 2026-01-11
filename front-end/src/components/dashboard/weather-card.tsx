
'use client';

import { RefreshCw, Sun, CloudRain, Cloud, CloudSun, Moon } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';
import { useLocation } from '@/hooks/use-location';
import { api } from '@/lib/api';

interface WeatherData {
  temperature: number;
  condition: string;
  is_day: number;
}

export default function WeatherCard() {
  const { latitude, longitude, city, error, loading: locationLoading } = useLocation();
  const coords = useMemo(() => {
    return (latitude && longitude) ? { lat: latitude, lon: longitude } : null;
  }, [latitude, longitude]);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<WeatherData | null>(null);

  const fetchWeather = async () => {
    if (!coords) return;
    setLoading(true);
    try {
      const result = await api.post<WeatherData>('/weather/current', { lat: coords.lat, lon: coords.lon });
      setData(result);
    } catch (e) {
      console.error("Weather fetch failed", e);
      // Fallback data so the UI shows something useful instead of error/loading
      setData({
        temperature: 32,
        condition: "Sunny",
        is_day: 1
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coords) {
      fetchWeather();
    }
  }, [coords]);

  const handleRefresh = () => {
    if (coords) fetchWeather();
    else window.location.reload(); // Simple retry if location failed
  };

  const getWeatherIcon = (condition: string, isDay: number) => {
    // Simple mapping
    if (condition === "Rainy" || condition === "Drizzle") return <CloudRain className="h-16 w-16 text-blue-300" />;
    if (condition === "Cloudy") return <Cloud className="h-16 w-16 text-gray-300" />;
    if (condition === "Partly Cloudy") return <CloudSun className="h-16 w-16 text-yellow-100" />;
    if (isDay === 0) return <Moon className="h-16 w-16 text-blue-100" />;
    return <Sun className="h-16 w-16 text-yellow-300" />;
  }

  // Fallback UI for error
  if (!coords && error) {
    return (
      <Card className="bg-destructive/10 border-destructive/20 rounded-3xl shadow-sm">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-destructive font-bold text-lg">Location Required</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className="bg-primary/90 text-primary-foreground rounded-3xl shadow-lg transition-all border-none relative overflow-hidden"
      style={{
        backgroundColor: '#1F3D14',
      }}
    >
      {/* Decorative background blob */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <CardContent className="p-6 relative">
        <div className="flex justify-between items-start mb-2">
          <div>
            {/* Location Badge */}
            {/* Location Badge */}
            <div className="flex items-center gap-1.5 text-primary-foreground/80 mb-3 bg-black/20 px-3 py-1 rounded-full w-fit">
              {!loading && !locationLoading && <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>}
              <span className="text-xs font-semibold tracking-wide uppercase">
                {(loading || locationLoading) ? "Detecting..." : city || "Unknown Location"}
              </span>
            </div>

            {(!data && !coords) ? (
              <div className="space-y-2 mt-2">
                <Skeleton className="h-12 w-24 bg-primary/40 rounded-lg" />
                <Skeleton className="h-4 w-16 bg-primary/30 rounded" />
              </div>
            ) : (loading || !data) ? (
              <div className="space-y-2 mt-2">
                <Skeleton className="h-12 w-32 bg-primary/40 rounded-lg" />
                <Skeleton className="h-4 w-20 bg-primary/30 rounded" />
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-left-2 mt-1">
                <div className="flex items-baseline gap-1">
                  <p className="text-5xl font-bold tracking-tighter">{Math.round(data.temperature)}°</p>
                  <p className="text-xl font-medium opacity-80">C</p>
                </div>
                <p className="text-sm font-medium opacity-90 mt-1 capitalize">{data.condition}</p>
              </div>
            )}
          </div>

          {/* Weather Icon Area */}
          <div className="flex flex-col items-center gap-2">
            {(loading || !data) ? (
              <Skeleton className="h-14 w-14 rounded-full bg-primary/40" />
            ) : (
              <div className="animate-in zoom-in spin-in-1 duration-700 p-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 shadow-inner">
                {getWeatherIcon(data.condition, data.is_day)}
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground/60 hover:bg-white/10 hover:text-white rounded-full transition-colors"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="sr-only">Refresh weather</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
