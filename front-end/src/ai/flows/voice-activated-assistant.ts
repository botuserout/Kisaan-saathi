'use server';

/**
 * @fileOverview Implements a voice-activated assistant flow for farmers.
 *
 * - voiceAssistant - A function that handles voice queries and returns farming advice or navigates the app.
 * - VoiceAssistantInput - The input type for the voiceAssistant function (a voice query string).
 * - VoiceAssistantOutput - The return type for the voiceAssistant function (farming advice or navigation command).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceAssistantInputSchema = z.object({
  query: z.string().describe('The voice query from the farmer.'),
});
export type VoiceAssistantInput = z.infer<typeof VoiceAssistantInputSchema>;

const VoiceAssistantOutputSchema = z.object({
  response: z.string().describe('The AI response to the voice query.'),
});
export type VoiceAssistantOutput = z.infer<typeof VoiceAssistantOutputSchema>;

export async function voiceAssistant(input: VoiceAssistantInput): Promise<VoiceAssistantOutput> {
  return voiceAssistantFlow(input);
}

const voiceAssistantPrompt = ai.definePrompt({
  name: 'voiceAssistantPrompt',
  input: {schema: VoiceAssistantInputSchema},
  output: {schema: VoiceAssistantOutputSchema},
  prompt: `You are a helpful AI assistant for farmers. Respond to the following voice query with helpful information or a navigation command.

Voice Query: {{{query}}}

Response:`,
});

const voiceAssistantFlow = ai.defineFlow(
  {
    name: 'voiceAssistantFlow',
    inputSchema: VoiceAssistantInputSchema,
    outputSchema: VoiceAssistantOutputSchema,
  },
  async input => {
    const {output} = await voiceAssistantPrompt(input);
    return output!;
  }
);
