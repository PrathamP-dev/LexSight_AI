import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Check if Gemini API key is available (try both old and new names)
const isAIEnabled = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

// Only initialize AI if API key is present
export const ai = isAIEnabled ? genkit({
  plugins: [googleAI({apiVersion: 'v1beta', apiKey: apiKey})],
  model: 'googleai/gemini-2.0-flash',
}) : null;

// Export flag to check AI availability
export { isAIEnabled };
