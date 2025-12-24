'use server';

/**
 * @fileOverview An AI agent that analyzes contracts for potential risks.
 *
 * - analyzeContractRisk - A function that analyzes contract text for risks.
 * - AnalyzeContractRiskInput - The input type for the analyzeContractRisk function.
 * - AnalyzeContractRiskOutput - The return type for the analyzeContractRisk function.
 */

import { isAIEnabled, callGroqAPI } from '@/ai/genkit';

export interface AnalyzeContractRiskInput {
  contractText: string;
}

export interface AnalyzeContractRiskOutput {
  riskSummary: string;
}

export async function analyzeContractRisk(input: AnalyzeContractRiskInput): Promise<AnalyzeContractRiskOutput> {
  if (!isAIEnabled) {
    return {
      riskSummary: "AI risk analysis is currently unavailable. Please configure GROQ_API_KEY to enable AI features. For now, please review the contract manually with a legal professional."
    };
  }

  try {
    const systemPrompt = `You are a legal expert specializing in contract risk analysis. You are thorough, precise, and your goal is to protect your client's interests.`;

    const userPrompt = `You will analyze the following contract text for potential risks. Your analysis should be comprehensive and presented in a clear, structured format.

For each identified risk, provide:
1. **Risk Category:** (e.g., Liability, Confidentiality, Termination, IP Rights, etc.)
2. **Clause Reference:** The specific clause number or section.
3. **Risk Description:** A clear explanation of the potential risk.
4. **Severity Level:** (Low, Medium, High)
5. **Suggested Mitigation:** Actionable advice on how to mitigate the risk (e.g., suggest alternative wording, recommend negotiation points).

Present your findings in a well-formatted markdown response. Start with an overall summary of the contract's risk profile.

Contract Text:
${input.contractText}`;

    const riskSummary = await callGroqAPI(userPrompt, systemPrompt);
    return { riskSummary };
  } catch (error) {
    console.error('Error in analyzeContractRisk:', error);
    throw error;
  }
}
