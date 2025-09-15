import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    'GEMINI_API_KEY is not set. Please set it in your .env file.'
  );
}

export const ai = genkit({
  plugins: [googleAI({apiVersion: 'v1'})],
  model: 'googleai/gemini-1.5-flash',
});
