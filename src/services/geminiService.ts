/**
 * Gemini AI Service
 * Handles communication with Google Gemini API for chat functionality
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config/apiKeys';
import { getDataCategories } from './contextBuilder';

// Initialize Gemini API client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// System prompt that teaches AI about the CR360 application
const SYSTEM_PROMPT = `You are an AI assistant integrated into CR360, a Credit Risk 360 application used by financial institutions for credit portfolio management. Your role is to help users understand and analyze their credit risk portfolio data.

KEY CAPABILITIES:
1. Answer questions about portfolio companies, exposures, and risk metrics
2. Explain credit risk concepts (NPA, PAR, ECL, PD, LGD, etc.)
3. Provide insights on specific companies or groups
4. Compare metrics across companies or time periods
5. Summarize complex financial data in simple terms
6. Guide users to relevant sections of the application

APPLICATION STRUCTURE:
${getDataCategories()}

IMPORTANT GUIDELINES:
- Always refer to the provided context to answer questions accurately
- When discussing specific companies or metrics, cite exact numbers from the context
- If data is not available in the context, clearly state "I don't have access to that information"
- Use financial terminology appropriately (Cr for Crores, % for percentages)
- Provide actionable insights when possible
- Be concise but thorough
- Format responses clearly with bullet points or numbered lists when appropriate
- When users ask about trends or comparisons, reference the specific data points

TONE:
- Professional and knowledgeable
- Clear and direct
- Helpful and solution-oriented
- Avoid overly technical jargon unless specifically asked

Remember: You have access to real-time application context in each message. Use it to provide context-aware, accurate responses.`;

/**
 * Send a message to Gemini AI with streaming response
 */
export async function sendMessageToGemini(
  userMessage: string,
  appContext: string,
  onChunk: (text: string) => void
): Promise<string> {
  try {
    // Use Gemini 2.5 Flash model (2025 version - fast and efficient)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Combine system prompt, app context, and user message
    const fullPrompt = `${SYSTEM_PROMPT}

CURRENT APPLICATION CONTEXT:
${appContext}

USER QUESTION: ${userMessage}

Provide a helpful response based on the context above:`;

    // Generate content with streaming
    const result = await model.generateContentStream(fullPrompt);

    let fullResponse = '';

    // Process streaming chunks
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      onChunk(chunkText);
    }

    return fullResponse;
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    console.error('Error message:', error.message);
    console.error('Error details:', error.response || error);

    // Handle specific error cases
    if (error.message?.includes('API_KEY') || error.message?.includes('API key not valid')) {
      throw new Error('Invalid API key. Please get a new API key from https://aistudio.google.com/app/apikey and update src/config/apiKeys.ts');
    } else if (error.message?.includes('not found') && error.message?.includes('model')) {
      throw new Error('Model not found. This might mean: (1) The API key is invalid or expired, or (2) The model name is incorrect. Please verify your API key at https://aistudio.google.com/app/apikey');
    } else if (error.message?.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later or get a new API key.');
    } else if (error.message?.includes('rate limit')) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    } else if (error.message?.includes('model')) {
      throw new Error('Model error: ' + error.message + '. Current model: gemini-2.5-flash');
    } else {
      throw new Error('Failed to get response from AI: ' + (error.message || 'Unknown error'));
    }
  }
}

/**
 * Send a message to Gemini AI without streaming (simpler version)
 */
export async function sendMessageToGeminiSimple(
  userMessage: string,
  appContext: string
): Promise<string> {
  try {
    // Use Gemini 2.5 Flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const fullPrompt = `${SYSTEM_PROMPT}

CURRENT APPLICATION CONTEXT:
${appContext}

USER QUESTION: ${userMessage}

Provide a helpful response based on the context above:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    console.error('Error message:', error.message);
    console.error('Error details:', error.response || error);

    if (error.message?.includes('API_KEY') || error.message?.includes('API key not valid')) {
      throw new Error('Invalid API key. Please get a new API key from https://aistudio.google.com/app/apikey and update src/config/apiKeys.ts');
    } else if (error.message?.includes('not found') && error.message?.includes('model')) {
      throw new Error('Model not found. This might mean: (1) The API key is invalid or expired, or (2) The model name is incorrect. Please verify your API key at https://aistudio.google.com/app/apikey');
    } else if (error.message?.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later or get a new API key.');
    } else if (error.message?.includes('rate limit')) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    } else if (error.message?.includes('model')) {
      throw new Error('Model error: ' + error.message + '. Current model: gemini-2.5-flash');
    } else {
      throw new Error('Failed to get response from AI: ' + (error.message || 'Unknown error'));
    }
  }
}

/**
 * Test API key validity and list available models
 * Useful for debugging API configuration issues
 */
export async function testAPIKey(): Promise<{
  isValid: boolean;
  models?: string[];
  error?: string;
}> {
  try {
    // Try to list available models to verify API key
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        isValid: false,
        error: `API key test failed: ${errorData.error?.message || response.statusText}`,
      };
    }

    const data = await response.json();
    const modelNames = data.models?.map((m: any) => m.name.replace('models/', '')) || [];

    console.log('✅ API Key is valid');
    console.log('Available models:', modelNames);

    return {
      isValid: true,
      models: modelNames,
    };
  } catch (error: any) {
    return {
      isValid: false,
      error: `Failed to test API key: ${error.message}`,
    };
  }
}

/**
 * Get information about a specific model
 */
export async function getModelInfo(modelName: string = 'gemini-2.5-flash'): Promise<any> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}?key=${GEMINI_API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to get model info: ${errorData.error?.message || response.statusText}`);
    }

    const modelInfo = await response.json();
    console.log('Model info:', modelInfo);
    return modelInfo;
  } catch (error: any) {
    console.error('Error getting model info:', error);
    throw error;
  }
}
