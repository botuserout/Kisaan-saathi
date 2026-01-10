'use server';
/**
 * @fileOverview An AI-powered crop recommendation flow.
 *
 * - recommendCrops - A function that recommends crops based on soil analysis and weather data.
 * - CropRecommendationInput - The input type for the recommendCrops function.
 * - CropRecommendationOutput - The return type for the recommendCrops function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropRecommendationInputSchema = z.object({
  soilAnalysis: z.string().describe('The analysis of the soil, including pH, nitrogen, phosphorus, and potassium levels.'),
  weatherData: z.string().describe('The weather data for the region, including temperature, rainfall, and sunlight hours.'),
  location: z.string().describe('The location of the farm.'),
});
export type CropRecommendationInput = z.infer<typeof CropRecommendationInputSchema>;

const CropRecommendationOutputSchema = z.object({
  recommendedCrops: z.array(z.string()).describe('The list of recommended crops to plant.'),
  reasoning: z.string().describe('The reasoning behind the crop recommendations.'),
});
export type CropRecommendationOutput = z.infer<typeof CropRecommendationOutputSchema>;

export async function recommendCrops(input: CropRecommendationInput): Promise<CropRecommendationOutput> {
  return recommendCropsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropRecommendationPrompt',
  input: {schema: CropRecommendationInputSchema},
  output: {schema: CropRecommendationOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the soil analysis, weather data, and location provided, recommend the best crops to plant. Provide a reasoning for your recommendation.

Soil Analysis: {{{soilAnalysis}}}
Weather Data: {{{weatherData}}}
Location: {{{location}}}

Respond with only valid JSON. The recommendedCrops should be a list of crop names.
`,
});

const recommendCropsFlow = ai.defineFlow(
  {
    name: 'recommendCropsFlow',
    inputSchema: CropRecommendationInputSchema,
    outputSchema: CropRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
