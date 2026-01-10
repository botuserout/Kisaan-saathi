'use client';

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
      console.warn("Geolocation not supported by browser.");
      fetchIpLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
        });
      },
      (err) => {
        // Fallback to IP location silently on error
        fetchIpLocation();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  async function fetchIpLocation() {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      setLocation({
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        country: data.country_name,
        loading: false,
      });
    } catch (error) {
      console.warn("IP location failed, using default:", error);

      // Final fallback: Default to New Delhi, India
      setLocation({
        latitude: 28.6139,
        longitude: 77.2090,
        city: "New Delhi",
        country: "India",
        loading: false,
      });
    }
  }

  return location;
}
