import { useState } from 'react';
import { AnthropicService } from '../services/ai/anthropicClient';
import { CodeReviewRequest, UltraThinkRequest } from '../types';
import { useConfigStore, getDecodedApiKey } from '../store/configStore';

export function useAI() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiKey = useConfigStore((state) => state.config.apiKey);

  const streamReview = async (
    request: CodeReviewRequest,
    onChunk: (chunk: string) => void,
    onComplete: () => void
  ) => {
    setIsStreaming(true);
    setError(null);

    try {
      const decodedKey = getDecodedApiKey(apiKey);
      if (!decodedKey) {
        throw new Error('API key not configured');
      }

      const service = new AnthropicService(decodedKey);
      const stream = service.streamCodeReview(request);

      console.log('[useAI] Starting to consume stream chunks...');
      let receivedCount = 0;
      for await (const chunk of stream) {
        receivedCount++;
        console.log(`[useAI] Received chunk #${receivedCount}, length: ${chunk.length}`);
        console.log(`[useAI] Calling onChunk callback...`);
        onChunk(chunk);
      }
      console.log(`[useAI] Stream consumption complete, total chunks received: ${receivedCount}`);

      onComplete();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsStreaming(false);
    }
  };

  const streamUltraThink = async (
    request: UltraThinkRequest,
    onChunk: (chunk: string) => void,
    onComplete: () => void
  ) => {
    setIsStreaming(true);
    setError(null);

    try {
      const decodedKey = getDecodedApiKey(apiKey);
      if (!decodedKey) {
        throw new Error('API key not configured');
      }

      const service = new AnthropicService(decodedKey);
      const stream = service.streamUltraThink(request);

      console.log('[useAI] UltraThink: Starting to consume stream chunks...');
      let receivedCount = 0;
      for await (const chunk of stream) {
        receivedCount++;
        console.log(`[useAI] UltraThink: Received chunk #${receivedCount}, length: ${chunk.length}`);
        console.log(`[useAI] UltraThink: Calling onChunk callback...`);
        onChunk(chunk);
      }
      console.log(`[useAI] UltraThink: Stream consumption complete, total chunks received: ${receivedCount}`);

      onComplete();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsStreaming(false);
    }
  };

  return {
    streamReview,
    streamUltraThink,
    isStreaming,
    error,
  };
}
