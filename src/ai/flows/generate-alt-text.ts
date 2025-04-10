'use server';
/**
 * @fileOverview A flow for generating alt-text for images that lack it.
 *
 * - generateAltText - A function that generates alt-text for an image.
 * - GenerateAltTextInput - The input type for the generateAltText function.
 * - GenerateAltTextOutput - The return type for the generateAltText function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateAltTextInputSchema = z.object({
  imageUrl: z.string().describe('The URL of the image to generate alt-text for.'),
});
export type GenerateAltTextInput = z.infer<typeof GenerateAltTextInputSchema>;

const GenerateAltTextOutputSchema = z.object({
  altText: z.string().describe('The generated alt-text for the image.'),
});
export type GenerateAltTextOutput = z.infer<typeof GenerateAltTextOutputSchema>;

export async function generateAltText(input: GenerateAltTextInput): Promise<GenerateAltTextOutput> {
  return generateAltTextFlow(input);
}

const generateAltTextPrompt = ai.definePrompt({
  name: 'generateAltTextPrompt',
  input: {
    schema: z.object({
      imageUrl: z.string().describe('The URL of the image to generate alt-text for.'),
    }),
  },
  output: {
    schema: z.object({
      altText: z.string().describe('The generated alt-text for the image.'),
    }),
  },
  prompt: `You are an expert in generating alt-text for images for use in HTML.

  Given the following image URL, generate alt-text that is descriptive, concise, and informative.
  The alt-text should be no more than 100 characters.

  Image URL: {{imageUrl}}
  `,
});

const generateAltTextFlow = ai.defineFlow<
  typeof GenerateAltTextInputSchema,
  typeof GenerateAltTextOutputSchema
>({
  name: 'generateAltTextFlow',
  inputSchema: GenerateAltTextInputSchema,
  outputSchema: GenerateAltTextOutputSchema,
},
async input => {
  const {output} = await generateAltTextPrompt(input);
  return output!;
});
