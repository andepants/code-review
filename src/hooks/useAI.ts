import { useState } from 'react';
import { AnthropicService } from '../services/ai/anthropicClient';
import { CodeReviewRequest } from '../types';
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

      for await (const chunk of stream) {
        onChunk(chunk);
      }

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
    isStreaming,
    error,
  };
}
