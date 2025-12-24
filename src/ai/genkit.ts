import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Check if Google API key is available
const isAIEnabled = !!process.env.GOOGLE_API_KEY;

// Only initialize AI if API key is present
export const ai = isAIEnabled ? genkit({
  plugins: [googleAI({apiVersion: 'v1beta', apiKey: process.env.GOOGLE_API_KEY})],
  model: 'googleai/gemini-2.0-flash',
}) : null;

// Export flag to check AI availability
export { isAIEnabled };
