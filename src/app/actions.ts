'use server';

import { summarizeEmailContent } from '@/ai/flows/summarize-email-content';
import { generateDraftReply } from '@/ai/flows/generate-draft-replies';
import { revalidatePath } from 'next/cache';

export async function summarizeAction(emailBody: string): Promise<string> {
  const result = await summarizeEmailContent({ emailBody });
  return result.summary;
}

export async function generateReplyAction(emailContent: string): Promise<string> {
  // In a real application, you might extract more specific information
  // or retrieve relevant documents from a knowledge base.
  const result = await generateDraftReply({
    emailContent,
    extractedInfo: 'No specific info extracted for this demo.',
    knowledgeBaseChunks: 'General company policy: be polite, helpful, and concise.',
  });
  return result.draftText;
}

export async function revalidate() {
  revalidatePath('/');
}
