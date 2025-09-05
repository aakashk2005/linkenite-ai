'use server';
/**
 * @fileOverview This file contains the Genkit flow for classifying email sentiment and priority.
 *
 * - classifyEmailSentimentAndPriority - A function that classifies the sentiment and priority of an email.
 * - ClassifyEmailSentimentAndPriorityInput - The input type for the classifyEmailSentimentAndPriority function.
 * - ClassifyEmailSentimentAndPriorityOutput - The return type for the classifyEmailSentimentAndPriority function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyEmailSentimentAndPriorityInputSchema = z.object({
  body: z.string().describe('The body of the email.'),
  subject: z.string().describe('The subject of the email.'),
});
export type ClassifyEmailSentimentAndPriorityInput = z.infer<typeof ClassifyEmailSentimentAndPriorityInputSchema>;

const ClassifyEmailSentimentAndPriorityOutputSchema = z.object({
  sentiment: z
    .string()
    .describe("The sentiment of the email, can be 'positive', 'negative', or 'neutral'."),
  priority: z
    .string()
    .describe("The priority of the email, can be 'high', 'medium', or 'low'."),
});
export type ClassifyEmailSentimentAndPriorityOutput = z.infer<typeof ClassifyEmailSentimentAndPriorityOutputSchema>;

export async function classifyEmailSentimentAndPriority(
  input: ClassifyEmailSentimentAndPriorityInput
): Promise<ClassifyEmailSentimentAndPriorityOutput> {
  return classifyEmailSentimentAndPriorityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyEmailSentimentAndPriorityPrompt',
  input: {schema: ClassifyEmailSentimentAndPriorityInputSchema},
  output: {schema: ClassifyEmailSentimentAndPriorityOutputSchema},
  prompt: `You are an AI assistant that analyzes the sentiment and priority of emails.

  Analyze the following email and determine its sentiment (positive, negative, or neutral) and priority (high, medium, or low).

  Subject: {{{subject}}}
  Body: {{{body}}}

  Return the sentiment and priority in JSON format.`,
});

const classifyEmailSentimentAndPriorityFlow = ai.defineFlow(
  {
    name: 'classifyEmailSentimentAndPriorityFlow',
    inputSchema: ClassifyEmailSentimentAndPriorityInputSchema,
    outputSchema: ClassifyEmailSentimentAndPriorityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
