'use server';

/**
 * @fileOverview Summarizes email content using AI.
 *
 * - summarizeEmailContent - A function that summarizes the content of an email.
 * - SummarizeEmailContentInput - The input type for the summarizeEmailContent function.
 * - SummarizeEmailContentOutput - The return type for the summarizeEmailContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEmailContentInputSchema = z.object({
  emailBody: z.string().describe('The body of the email to summarize.'),
});
export type SummarizeEmailContentInput = z.infer<
  typeof SummarizeEmailContentInputSchema
>;

const SummarizeEmailContentOutputSchema = z.object({
  summary: z.string().describe('A short summary of the email content.'),
});
export type SummarizeEmailContentOutput = z.infer<
  typeof SummarizeEmailContentOutputSchema
>;

export async function summarizeEmailContent(
  input: SummarizeEmailContentInput
): Promise<SummarizeEmailContentOutput> {
  return summarizeEmailContentFlow(input);
}

const summarizeEmailContentPrompt = ai.definePrompt({
  name: 'summarizeEmailContentPrompt',
  input: {schema: SummarizeEmailContentInputSchema},
  output: {schema: SummarizeEmailContentOutputSchema},
  prompt: `Summarize the following email content in a concise manner:\n\n{{{emailBody}}}`,
});

const summarizeEmailContentFlow = ai.defineFlow(
  {
    name: 'summarizeEmailContentFlow',
    inputSchema: SummarizeEmailContentInputSchema,
    outputSchema: SummarizeEmailContentOutputSchema,
  },
  async input => {
    const {output} = await summarizeEmailContentPrompt(input);
    return output!;
  }
);
