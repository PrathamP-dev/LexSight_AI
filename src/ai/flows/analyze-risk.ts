'use server';

/**
 * @fileOverview An AI agent that analyzes contracts for potential risks.
 *
 * - analyzeContractRisk - A function that analyzes contract text for risks.
 * - AnalyzeContractRiskInput - The input type for the analyzeContractRisk function.
 * - AnalyzeContractRiskOutput - The return type for the analyzeContractRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeContractRiskInputSchema = z.object({
  contractText: z
    .string()
    .describe('The text of the contract to analyze for potential risks.'),
});
export type AnalyzeContractRiskInput = z.infer<typeof AnalyzeContractRiskInputSchema>;

const AnalyzeContractRiskOutputSchema = z.object({
  riskSummary: z
    .string()
    .describe(
      'A summary of the potential risks identified in the contract, along with insights and warnings.'
    ),
});
export type AnalyzeContractRiskOutput = z.infer<typeof AnalyzeContractRiskOutputSchema>;

export async function analyzeContractRisk(input: AnalyzeContractRiskInput): Promise<AnalyzeContractRiskOutput> {
  return analyzeContractRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeContractRiskPrompt',
  input: {schema: AnalyzeContractRiskInputSchema},
  output: {schema: AnalyzeContractRiskOutputSchema},
  prompt: `You are a legal expert specializing in contract risk analysis.

You will analyze the following contract text for potential risks and provide a summary of your findings, including specific clauses of concern and potential consequences.

Contract Text:
{{{contractText}}}`,
});

const analyzeContractRiskFlow = ai.defineFlow(
  {
    name: 'analyzeContractRiskFlow',
    inputSchema: AnalyzeContractRiskInputSchema,
    outputSchema: AnalyzeContractRiskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
