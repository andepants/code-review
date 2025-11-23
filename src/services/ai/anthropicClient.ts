import Anthropic from '@anthropic-ai/sdk';
import { CodeReviewRequest, CodeReviewResponse, UltraThinkRequest } from '../../types';
import { buildPrompt } from './promptBuilder';
import { ModelService } from './modelService';

export class AnthropicService {
  private client: Anthropic;
  private apiKey: string;
  private modelPromise: Promise<string> | null = null;

  constructor(apiKey: string) {
    console.log('[AnthropicService] Initializing service...');
    this.apiKey = apiKey;
    this.client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true, // Client-side usage
    });
    // Pre-fetch the model on initialization
    console.log('[AnthropicService] Pre-fetching latest Haiku model...');
    this.modelPromise = ModelService.getLatestHaikuModel(apiKey);
    this.modelPromise.then(model => {
      console.log(`[AnthropicService] Successfully initialized with model: ${model}`);
    }).catch(error => {
      console.error('[AnthropicService] Failed to fetch model during initialization:', error);
    });
  }

  /**
   * Gets the latest Haiku model ID
   */
  private async getModel(): Promise<string> {
    if (!this.modelPromise) {
      console.log('[AnthropicService] Model promise not found, fetching model...');
      this.modelPromise = ModelService.getLatestHaikuModel(this.apiKey);
    }
    const model = await this.modelPromise;
    console.log(`[AnthropicService] Using model: ${model}`);
    return model;
  }

  async *streamCodeReview(request: CodeReviewRequest): AsyncGenerator<string> {
    console.log('[AnthropicService] Starting streamCodeReview...');
    const prompt = buildPrompt(request);
    const model = await this.getModel();

    try {
      console.log(`[AnthropicService] Creating stream with model: ${model}`);
      const stream = this.client.messages.stream({
        model,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      });

      console.log('[AnthropicService] Stream created, processing chunks...');
      console.log('[AnthropicService] Stream object type:', typeof stream, stream.constructor.name);
      let chunkCount = 0;
      let totalIterations = 0;
      for await (const chunk of stream) {
        totalIterations++;
        console.log(`[AnthropicService] Loop iteration #${totalIterations}, chunk type: ${chunk.type}`);
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          chunkCount++;
          console.log(`[AnthropicService] Chunk #${chunkCount}, text length: ${chunk.delta.text.length}, text: "${chunk.delta.text.substring(0, 50)}..."`);
          yield chunk.delta.text;
        }
      }
      console.log(`[AnthropicService] Stream completed successfully, total chunks: ${chunkCount}, total iterations: ${totalIterations}`);
    } catch (error) {
      console.error('[AnthropicService] Error in streamCodeReview:', error);
      if (error instanceof Anthropic.APIError) {
        console.error('[AnthropicService] Anthropic API Error:', {
          status: error.status,
          message: error.message,
        });
        throw new Error(`API Error: ${error.status} - ${error.message}`);
      }
      console.error('[AnthropicService] Unknown error type:', error);
      throw error;
    }
  }

  /**
   * Stream UltraThink responses with markdown rendering support
   */
  async *streamUltraThink(request: UltraThinkRequest): AsyncGenerator<string> {
    console.log('[AnthropicService] Starting streamUltraThink...');
    const model = await this.getModel();

    // Build messages array from conversation history
    const messages: Anthropic.MessageParam[] = [];

    // Add conversation history if provided
    if (request.conversationHistory && request.conversationHistory.length > 0) {
      request.conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      });
    }

    // Add current message
    messages.push({
      role: 'user',
      content: request.message,
    });

    try {
      console.log(`[AnthropicService] Creating stream with model: ${model}`);
      const stream = this.client.messages.stream({
        model,
        max_tokens: 4096,
        messages,
        system: request.systemPrompt,
      });

      console.log('[AnthropicService] Stream created, processing chunks...');
      let chunkCount = 0;
      for await (const chunk of stream) {
        // Extract text from content_block_delta events
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          chunkCount++;
          console.log(`[AnthropicService] UltraThink Chunk #${chunkCount}, text length: ${chunk.delta.text.length}, text: "${chunk.delta.text.substring(0, 50)}..."`);
          yield chunk.delta.text;
        }
      }
      console.log(`[AnthropicService] UltraThink stream completed successfully, total chunks: ${chunkCount}`);
    } catch (error) {
      console.error('[AnthropicService] Error in streamUltraThink:', error);
      if (error instanceof Anthropic.APIError) {
        console.error('[AnthropicService] Anthropic API Error:', {
          status: error.status,
          message: error.message,
        });
        throw new Error(`API Error: ${error.status} - ${error.message}`);
      }
      console.error('[AnthropicService] Unknown error type:', error);
      throw error;
    }
  }

  async getCodeReview(request: CodeReviewRequest): Promise<CodeReviewResponse> {
    console.log('[AnthropicService] Starting getCodeReview...');
    const prompt = buildPrompt(request);
    const model = await this.getModel();

    try {
      console.log(`[AnthropicService] Creating message with model: ${model}`);
      const response = await this.client.messages.create({
        model,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      });

      console.log('[AnthropicService] Response received:', {
        model: response.model,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        console.error('[AnthropicService] Unexpected response type:', content.type);
        throw new Error('Unexpected response type');
      }

      console.log('[AnthropicService] Code review completed successfully');
      return {
        content: content.text,
        model: response.model,
        tokens: response.usage.input_tokens + response.usage.output_tokens,
      };
    } catch (error) {
      console.error('[AnthropicService] Error in getCodeReview:', error);
      if (error instanceof Anthropic.APIError) {
        console.error('[AnthropicService] Anthropic API Error:', {
          status: error.status,
          message: error.message,
        });
        throw new Error(`API Error: ${error.status} - ${error.message}`);
      }
      console.error('[AnthropicService] Unknown error type:', error);
      throw error;
    }
  }
}
