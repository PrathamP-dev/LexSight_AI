'use server';

/**
 * @fileOverview AI flow for summarizing a selected clause from a document.
 *
 * - summarizeClause - A function that generates a simplified summary of a given clause.
 * - SummarizeClauseInput - The input type for the summarizeClause function.
 * - SummarizeClauseOutput - The return type for the summarizeClause function.
 */

import { isAIEnabled, callGroqAPI } from '@/ai/genkit';

export interface SummarizeClauseInput {
  clauseText: string;
}

export interface SummarizeClauseOutput {
  summary: string;
}

export async function summarizeClause(input: SummarizeClauseInput): Promise<SummarizeClauseOutput> {
  if (!isAIEnabled) {
    return {
      summary: "AI summarization is currently unavailable. Please configure GROQ_API_KEY to enable AI features. For now, please review the clause manually."
    };
  }

  try {
    const systemPrompt = `You are an AI assistant that specializes in summarizing legal clauses in plain language. Provide concise and easy-to-understand summaries.`;

    const userPrompt = `Please provide a concise and easy-to-understand summary of the following clause:

${input.clauseText}`;

    const summary = await callGroqAPI(userPrompt, systemPrompt);
    return { summary };
  } catch (error) {
    console.error('Error in summarizeClause:', error);
    throw error;
  }
}
