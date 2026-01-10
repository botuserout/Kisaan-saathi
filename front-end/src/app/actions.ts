'use server';

import { z } from 'zod';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// We need a helper to fetch from backend
async function fetchBackend(endpoint: string, data: any, token: string) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
    cache: 'no-store'
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Backend request failed');
  }
  return res.json();
}

const diseaseDetectionSchema = z.object({
  image: z.string().min(1, "Image is required"), // Expecting Base64 string now
  token: z.string().min(1, "User not authenticated"),
});

export type DiseaseDetectionState = {
  result?: any;
  error?: string;
  formErrors?: { image?: string[] };
};

export async function detectDisease(
  prevState: DiseaseDetectionState,
  formData: FormData
): Promise<DiseaseDetectionState> {
  // Client must convert file to base64 and put it in 'image' field, OR we handle it here if it's a file
  // But easier if we grab the 'token' from formData

  const token = formData.get('token') as string;
  const imageFile = formData.get('image') as File;

  if (!token) return { error: "You must be logged in." };

  // Convert File to Base64
  let dataUri = '';
  if (imageFile && imageFile.size > 0) {
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    dataUri = `data:${imageFile.type};base64,${base64}`;
  } else {
    // Maybe it was passed as string?
    dataUri = formData.get('image') as string;
  }

  if (!dataUri) return { error: "Image is required." };

  try {
    const response = await fetchBackend('/features/disease-detection', { image: dataUri }, token);
    return { result: response.result };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unexpected error occurred.' };
  }
}

const cropRecommendationSchema = z.object({
  soilAnalysis: z.string().min(2),
  weatherData: z.string().min(2),
  location: z.string().min(2),
  token: z.string().min(1),
});

export type CropRecommendationState = {
  result?: any;
  error?: string;
  formErrors?: z.ZodError['errors'];
}

export async function getCropRecommendation(
  prevState: CropRecommendationState,
  formData: FormData
): Promise<CropRecommendationState> {
  const token = formData.get('token') as string;
  if (!token) return { error: "You must be logged in." };

  const data = {
    soilAnalysis: formData.get('soilAnalysis'),
    weatherData: formData.get('weatherData'),
    location: formData.get('location'),
  };

  try {
    const response = await fetchBackend('/features/crop-recommendation', data, token);
    return { result: response.result };
  } catch (e: any) {
    console.error(e);
    return { error: e.message };
  }
}

const yieldPredictionSchema = z.object({
  // inputs
});

export type YieldPredictionState = {
  result?: any;
  error?: string;
  formErrors?: any;
}

export async function getYieldPrediction(
  prevState: YieldPredictionState,
  formData: FormData
): Promise<YieldPredictionState> {
  const token = formData.get('token') as string;
  if (!token) return { error: "You must be logged in." };

  const data = Object.fromEntries(formData.entries());
  // Remove token from data sent to backend if not needed in body
  // Our backend expects strict schema, so we should filter
  const payload = {
    cropType: data.cropType,
    farmSize: Number(data.farmSize),
    historicalYieldData: data.historicalYieldData,
    currentWeatherData: data.currentWeatherData,
    soilType: data.soilType,
    fertilizerUsed: data.fertilizerUsed
  };

  try {
    const response = await fetchBackend('/features/yield-prediction', payload, token);
    return { result: response.result };
  } catch (e: any) {
    console.error(e);
    return { error: e.message };
  }
}
