import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("Warning: GEMINI_API_KEY is missing from environment variables. AI features may not work.");
}

export const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
  model: 'googleai/gemini-pro',
});
