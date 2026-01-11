"use client";

import { useEffect, useState } from "react";

type LocationState = {
  latitude: number | null;
  longitude: number | null;
  city?: string;
  country?: string;
  error?: string;
  loading: boolean;
};

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, loading: false, error: "Geolocation not supported" }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Success: We have coords, now get the city name
        try {
          const cityData = await reverseGeocode(latitude, longitude);
          setLocation({
            latitude,
            longitude,
            city: cityData.city,
            country: cityData.country,
            loading: false,
            error: undefined
          });
        } catch (err) {
          // If reverse geocoding fails, at least we have coords
          setLocation({
            latitude,
            longitude,
            loading: false,
            error: undefined,
            city: "Unknown Location"
          });
        }
      },
      (err) => {
        // Error: Permission denied or timeout
        console.warn("Geolocation error:", err.message);
        setLocation({
          latitude: null,
          longitude: null,
          loading: false,
          error: "Location access denied. Please enable GPS.",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, []);

  async function reverseGeocode(lat: number, lon: number) {
    // Use a free client-side reverse geocoding API (BigDataCloud is robust for this)
    // No API key required for client-side use
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    const data = await res.json();
    return {
      city: data.city || data.locality || data.principalSubdivision || "Unknown",
      country: data.countryName
    };
  }

  return location;
}
