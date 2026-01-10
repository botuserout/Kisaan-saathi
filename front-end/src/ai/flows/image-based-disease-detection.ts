'use server';
/**
 * @fileOverview An image-based plant disease detection AI agent.
 *
 * - imageBasedDiseaseDetection - A function that handles the plant disease detection process.
 * - ImageBasedDiseaseDetectionInput - The input type for the imageBasedDiseaseDetection function.
 * - ImageBasedDiseaseDetectionOutput - The return type for the imageBasedDiseaseDetection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageBasedDiseaseDetectionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a plant leaf, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type ImageBasedDiseaseDetectionInput = z.infer<typeof ImageBasedDiseaseDetectionInputSchema>;

const ImageBasedDiseaseDetectionOutputSchema = z.object({
  diseaseName: z.string().describe('The name of the identified disease.'),
  confidence: z.number().describe('The confidence percentage of the disease identification.'),
  symptoms: z.string().describe('Symptoms and signs of the disease.'),
  affectedCrops: z.string().describe('Commonly affected crops by the disease.'),
  organicTreatments: z.string().describe('Organic treatments for the disease.'),
});
export type ImageBasedDiseaseDetectionOutput = z.infer<typeof ImageBasedDiseaseDetectionOutputSchema>;

export async function imageBasedDiseaseDetection(input: ImageBasedDiseaseDetectionInput): Promise<ImageBasedDiseaseDetectionOutput> {
  return imageBasedDiseaseDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'imageBasedDiseaseDetectionPrompt',
  input: {schema: ImageBasedDiseaseDetectionInputSchema},
  output: {schema: ImageBasedDiseaseDetectionOutputSchema},
  prompt: `You are an expert in plant pathology, specializing in identifying plant diseases from images.

You will analyze the provided image of a plant leaf and identify potential diseases, suggest treatments, and provide other information about the disease.

Analyze the following image to identify the disease and provide relevant information.

Image: {{media url=photoDataUri}}

Output the results in JSON format, making sure that all fields are populated and accurate.

Output format: 
{
  "diseaseName": "",
  "confidence": 0,
  "symptoms": "",
  "affectedCrops": "",
  "organicTreatments": ""
}`,
});

const imageBasedDiseaseDetectionFlow = ai.defineFlow(
  {
    name: 'imageBasedDiseaseDetectionFlow',
    inputSchema: ImageBasedDiseaseDetectionInputSchema,
    outputSchema: ImageBasedDiseaseDetectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
