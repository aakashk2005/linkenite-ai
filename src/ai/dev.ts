import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-email-content.ts';
import '@/ai/flows/classify-email-sentiment-and-priority.ts';
import '@/ai/flows/generate-draft-replies.ts';
