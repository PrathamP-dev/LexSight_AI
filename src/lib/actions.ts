'use server';

import { analyzeContractRisk } from '@/ai/flows/analyze-risk';
import { summarizeClause } from '@/ai/flows/summarize-clause';

export async function handleSummarizeClause(clauseText: string) {
  if (!clauseText) {
    return { summary: "Please select a clause to summarize." };
  }
  try {
    const result = await summarizeClause({ clauseText });
    return result;
  } catch (error) {
    console.error('Error summarizing clause:', error);
    return { summary: "An error occurred while summarizing. Please try again." };
  }
}

export async function handleAnalyzeRisk(contractText: string) {
  if (!contractText) {
    return { riskSummary: "No document content to analyze." };
  }
  try {
    const result = await analyzeContractRisk({ contractText });
    return result;
  } catch (error) {
    console.error('Error analyzing risk:', error);
    return { riskSummary: "An error occurred during risk analysis. Please try again." };
  }
}
