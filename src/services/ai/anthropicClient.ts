import Anthropic from '@anthropic-ai/sdk';
import { CodeReviewRequest, CodeReviewResponse, UltraThinkRequest } from '../../types';
import { buildPrompt } from './promptBuilder';
import { ModelService } from './modelService';

export class AnthropicService {
  private client: Anthropic;
  private apiKey: string;
  private modelPromise: Promise<string> | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true, // Client-side usage
    });
    // Pre-fetch the model on initialization
    this.modelPromise = ModelService.getLatestHaikuModel(apiKey);
  }

  /**
   * Gets the latest Haiku model ID
   */
  private async getModel(): Promise<string> {
    if (!this.modelPromise) {
      this.modelPromise = ModelService.getLatestHaikuModel(this.apiKey);
    }
    return await this.modelPromise;
  }

  async *streamCodeReview(request: CodeReviewRequest): AsyncGenerator<string> {
    const prompt = buildPrompt(request);
    const model = await this.getModel();

    try {
      const stream = this.client.messages.stream({
        model,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      });

      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          yield chunk.delta.text;
        }
      }
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        throw new Error(`API Error: ${error.status} - ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Stream UltraThink responses with markdown rendering support
   */
  async *streamUltraThink(request: UltraThinkRequest): AsyncGenerator<string> {
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
      const stream = this.client.messages.stream({
        model,
        max_tokens: 4096,
        messages,
        system: request.systemPrompt,
      });

      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          yield chunk.delta.text;
        }
      }
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        throw new Error(`API Error: ${error.status} - ${error.message}`);
      }
      throw error;
    }
  }

  async getCodeReview(request: CodeReviewRequest): Promise<CodeReviewResponse> {
    const prompt = buildPrompt(request);
    const model = await this.getModel();

    try {
      const response = await this.client.messages.create({
        model,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type');
      }

      return {
        content: content.text,
        model: response.model,
        tokens: response.usage.input_tokens + response.usage.output_tokens,
      };
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        throw new Error(`API Error: ${error.status} - ${error.message}`);
      }
      throw error;
    }
  }
}
