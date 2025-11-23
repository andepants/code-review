import Anthropic from '@anthropic-ai/sdk';

interface ModelInfo {
  id: string;
  created_at: string;
  display_name: string;
  type: 'model';
}

interface ModelsListResponse {
  data: ModelInfo[];
  first_id: string;
  last_id: string;
  has_more: boolean;
}

/**
 * Service for managing Anthropic models
 */
export class ModelService {
  private static cachedModels: ModelInfo[] | null = null;
  private static lastFetch: number = 0;
  private static readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

  /**
   * Fetches all available models from the Anthropic API
   */
  private static async fetchAllModels(apiKey: string): Promise<ModelInfo[]> {
    console.log('[ModelService] Fetching available models from Anthropic API...');

    const allModels: ModelInfo[] = [];
    let hasMore = true;
    let afterId: string | undefined;
    let pageCount = 0;

    try {
      // Fetch all pages of models
      while (hasMore) {
        pageCount++;
        const url = 'https://api.anthropic.com/v1/models' +
          (afterId ? `?after_id=${afterId}` : '');

        console.log(`[ModelService] Fetching page ${pageCount}: ${url}`);

        // Required for CORS support in browser environments
        // WARNING: This exposes API keys in browser - only use for:
        // - Internal tools with trusted users
        // - "Bring your own API key" patterns
        // - Development/testing environments
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
        });

        console.log(`[ModelService] Response status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unable to read error response');
          console.error('[ModelService] API Error Response:', errorText);
          throw new Error(`Failed to fetch models: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data: ModelsListResponse = await response.json();
        console.log(`[ModelService] Received ${data.data.length} models on page ${pageCount}`);
        console.log('[ModelService] Models:', data.data.map(m => m.id).join(', '));

        allModels.push(...data.data);
        hasMore = data.has_more;
        afterId = data.last_id;

        console.log(`[ModelService] Has more pages: ${hasMore}`);
      }

      console.log(`[ModelService] Successfully fetched ${allModels.length} total models`);
      return allModels;

    } catch (error) {
      console.error('[ModelService] Error fetching models:', error);
      if (error instanceof Error) {
        console.error('[ModelService] Error message:', error.message);
        console.error('[ModelService] Error stack:', error.stack);
      }
      throw error;
    }
  }

  /**
   * Gets all available models with caching
   */
  static async getAvailableModels(apiKey: string): Promise<ModelInfo[]> {
    const now = Date.now();
    const cacheAge = this.cachedModels ? now - this.lastFetch : -1;

    // Return cached models if still valid
    if (
      this.cachedModels &&
      cacheAge < this.CACHE_DURATION
    ) {
      console.log(`[ModelService] Returning ${this.cachedModels.length} cached models (age: ${Math.round(cacheAge / 1000)}s)`);
      return this.cachedModels;
    }

    console.log('[ModelService] Cache expired or empty, fetching fresh models...');

    // Fetch fresh models
    try {
      this.cachedModels = await this.fetchAllModels(apiKey);
      this.lastFetch = now;
      console.log(`[ModelService] Successfully cached ${this.cachedModels.length} models`);
      return this.cachedModels;
    } catch (error) {
      console.error('[ModelService] Failed to fetch models from API');
      throw error;
    }
  }

  /**
   * Gets the latest Haiku model
   * Models are returned in reverse chronological order (newest first)
   * Falls back to a known working model if API call fails
   */
  static async getLatestHaikuModel(apiKey: string): Promise<string> {
    const FALLBACK_MODEL = 'claude-3-5-haiku-20241022';

    try {
      console.log('[ModelService] Getting latest Haiku model...');
      const models = await this.getAvailableModels(apiKey);

      // Filter for Haiku models (case-insensitive search for "haiku" in the ID)
      const haikuModels = models.filter(model =>
        model.id.toLowerCase().includes('haiku')
      );

      console.log(`[ModelService] Found ${haikuModels.length} Haiku models:`, haikuModels.map(m => m.id));

      if (haikuModels.length === 0) {
        console.warn('[ModelService] No Haiku models found in API response, using fallback');
        console.warn(`[ModelService] Fallback model: ${FALLBACK_MODEL}`);
        return FALLBACK_MODEL;
      }

      // Return the first one (most recent)
      const selectedModel = haikuModels[0].id;
      console.log(`[ModelService] Selected latest Haiku model: ${selectedModel}`);
      return selectedModel;

    } catch (error) {
      console.error('[ModelService] Failed to fetch Haiku model from API, using fallback');
      console.error('[ModelService] Error details:', error);
      console.warn(`[ModelService] Using fallback model: ${FALLBACK_MODEL}`);
      return FALLBACK_MODEL;
    }
  }

  /**
   * Gets the latest Sonnet model
   * Models are returned in reverse chronological order (newest first)
   * Falls back to a known working model if API call fails
   */
  static async getLatestSonnetModel(apiKey: string): Promise<string> {
    const FALLBACK_MODEL = 'claude-3-5-sonnet-20241022';

    try {
      console.log('[ModelService] Getting latest Sonnet model...');
      const models = await this.getAvailableModels(apiKey);

      // Filter for Sonnet models (case-insensitive search for "sonnet" in the ID)
      const sonnetModels = models.filter(model =>
        model.id.toLowerCase().includes('sonnet')
      );

      console.log(`[ModelService] Found ${sonnetModels.length} Sonnet models:`, sonnetModels.map(m => m.id));

      if (sonnetModels.length === 0) {
        console.warn('[ModelService] No Sonnet models found in API response, using fallback');
        console.warn(`[ModelService] Fallback model: ${FALLBACK_MODEL}`);
        return FALLBACK_MODEL;
      }

      // Return the first one (most recent)
      const selectedModel = sonnetModels[0].id;
      console.log(`[ModelService] Selected latest Sonnet model: ${selectedModel}`);
      return selectedModel;

    } catch (error) {
      console.error('[ModelService] Failed to fetch Sonnet model from API, using fallback');
      console.error('[ModelService] Error details:', error);
      console.warn(`[ModelService] Using fallback model: ${FALLBACK_MODEL}`);
      return FALLBACK_MODEL;
    }
  }

  /**
   * Gets the latest Opus model
   * Models are returned in reverse chronological order (newest first)
   * Falls back to a known working model if API call fails
   */
  static async getLatestOpusModel(apiKey: string): Promise<string> {
    const FALLBACK_MODEL = 'claude-3-opus-20240229';

    try {
      console.log('[ModelService] Getting latest Opus model...');
      const models = await this.getAvailableModels(apiKey);

      // Filter for Opus models (case-insensitive search for "opus" in the ID)
      const opusModels = models.filter(model =>
        model.id.toLowerCase().includes('opus')
      );

      console.log(`[ModelService] Found ${opusModels.length} Opus models:`, opusModels.map(m => m.id));

      if (opusModels.length === 0) {
        console.warn('[ModelService] No Opus models found in API response, using fallback');
        console.warn(`[ModelService] Fallback model: ${FALLBACK_MODEL}`);
        return FALLBACK_MODEL;
      }

      // Return the first one (most recent)
      const selectedModel = opusModels[0].id;
      console.log(`[ModelService] Selected latest Opus model: ${selectedModel}`);
      return selectedModel;

    } catch (error) {
      console.error('[ModelService] Failed to fetch Opus model from API, using fallback');
      console.error('[ModelService] Error details:', error);
      console.warn(`[ModelService] Using fallback model: ${FALLBACK_MODEL}`);
      return FALLBACK_MODEL;
    }
  }

  /**
   * Clears the model cache (useful for testing or forcing a refresh)
   */
  static clearCache(): void {
    this.cachedModels = null;
    this.lastFetch = 0;
  }
}
