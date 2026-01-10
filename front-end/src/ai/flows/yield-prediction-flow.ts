'use server';

/**
 * @fileOverview Estimates crop yield based on historical data and current conditions.
 *
 * - predictYield - A function that handles the yield prediction process.
 * - PredictYieldInput - The input type for the predictYield function.
 * - PredictYieldOutput - The return type for the predictYield function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictYieldInputSchema = z.object({
  cropType: z.string().describe('The type of crop (e.g., wheat, corn, rice).'),
  farmSize: z.number().describe('The size of the farm in acres.'),
  historicalYieldData: z.string().describe('Historical yield data for the farm (e.g., previous 5 years of yield in tons).'),
  currentWeatherData: z.string().describe('Current weather conditions for the farm (e.g., temperature, rainfall, humidity).'),
  soilType: z.string().describe('The type of soil on the farm (e.g., sandy, clay, loam).'),
  fertilizerUsed: z.string().describe('The type and amount of fertilizer used on the farm.'),
});
export type PredictYieldInput = z.infer<typeof PredictYieldInputSchema>;

const PredictYieldOutputSchema = z.object({
  estimatedYield: z.number().describe('The estimated yield of the crop in tons.'),
  confidenceInterval: z.string().describe('A range of values within which the true yield is likely to fall (e.g., +/- 10%).'),
  factorsInfluencingYield: z.string().describe('A list of factors that are most likely to influence the yield (e.g., weather, pests, diseases).'),
  recommendations: z.string().describe('Recommendations for improving yield (e.g., fertilizer application, irrigation).'),
});
export type PredictYieldOutput = z.infer<typeof PredictYieldOutputSchema>;

export async function predictYield(input: PredictYieldInput): Promise<PredictYieldOutput> {
  return predictYieldFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictYieldPrompt',
  input: {schema: PredictYieldInputSchema},
  output: {schema: PredictYieldOutputSchema},
  prompt: `You are an expert agricultural advisor. Given the following information about a farm, estimate the crop yield and provide recommendations for improving yield.

Crop Type: {{{cropType}}}
Farm Size: {{{farmSize}}} acres
Historical Yield Data: {{{historicalYieldData}}}
Current Weather Data: {{{currentWeatherData}}}
Soil Type: {{{soilType}}}
Fertilizer Used: {{{fertilizerUsed}}}

Consider all factors and provide an estimate of the yield in tons, a confidence interval for the estimate, factors influencing the yield, and recommendations for improving yield.

Format the estimatedYield as a number.
`,
});

const predictYieldFlow = ai.defineFlow(
  {
    name: 'predictYieldFlow',
    inputSchema: PredictYieldInputSchema,
    outputSchema: PredictYieldOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
