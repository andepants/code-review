# AI Model Configuration

## Overview

The AI Code Review Assistant now uses **dynamic model selection** that automatically fetches and uses the latest available Claude models from Anthropic's API. This ensures the application is future-proof and won't break when new models are released or old ones are deprecated.

## How It Works

### 1. Automatic Model Discovery

The `ModelService` automatically:
- Fetches all available models from the Anthropic API (`/v1/models` endpoint)
- Caches the results for 1 hour to minimize API calls
- Selects the latest model from the specified tier (Haiku, Sonnet, or Opus)
- Models are returned in reverse chronological order (newest first)

### 2. Model Tiers

The application supports three Claude model tiers:

- **Haiku** (Default): Fast, cost-effective model ideal for code review tasks
- **Sonnet**: Balanced performance and capability
- **Opus**: Most capable model for complex analysis

### 3. Configuration

The default model tier is configured in `src/config/constants.ts`:

```typescript
export const DEFAULT_MODEL_TIER = 'haiku'; // Options: 'haiku', 'sonnet', 'opus'
```

## Implementation Details

### ModelService

Located in `src/services/ai/modelService.ts`, the service provides:

- `getLatestHaikuModel(apiKey)`: Returns the latest Haiku model ID
- `getLatestSonnetModel(apiKey)`: Returns the latest Sonnet model ID
- `getLatestOpusModel(apiKey)`: Returns the latest Opus model ID
- `getAvailableModels(apiKey)`: Returns all available models (cached)
- `clearCache()`: Clears the model cache (useful for testing)

### AnthropicClient Integration

The `AnthropicService` class automatically:
1. Pre-fetches the latest Haiku model on initialization
2. Uses the cached model promise for all API calls
3. Ensures zero additional latency after the first call

## Benefits

### Future-Proof
✅ Automatically uses new Claude models as they're released
✅ No code changes needed when models are updated
✅ Prevents "model not found" errors from deprecated models

### Performance
✅ Models are cached for 1 hour to minimize API calls
✅ Pre-fetched on service initialization
✅ Pagination support for large model lists

### Flexibility
✅ Easy to switch between model tiers
✅ Can be extended to support user preferences
✅ Centralized configuration

## Migration Notes

### Previous Implementation
```typescript
// Hardcoded model (old approach)
model: 'claude-3-5-sonnet-20241022'
```

### New Implementation
```typescript
// Dynamic model selection (new approach)
const model = await this.getModel();
```

## Example: Switching Model Tiers

To use a different model tier, update `src/config/constants.ts`:

```typescript
// For faster, more cost-effective responses
export const DEFAULT_MODEL_TIER = 'haiku';

// For balanced performance
export const DEFAULT_MODEL_TIER = 'sonnet';

// For maximum capability
export const DEFAULT_MODEL_TIER = 'opus';
```

Then update `AnthropicService` constructor in `src/services/ai/anthropicClient.ts` to use the desired tier:

```typescript
import { DEFAULT_MODEL_TIER } from '../../config/constants';

// In constructor:
if (DEFAULT_MODEL_TIER === 'sonnet') {
  this.modelPromise = ModelService.getLatestSonnetModel(apiKey);
} else if (DEFAULT_MODEL_TIER === 'opus') {
  this.modelPromise = ModelService.getLatestOpusModel(apiKey);
} else {
  this.modelPromise = ModelService.getLatestHaikuModel(apiKey);
}
```

## API Reference

### Anthropic Models List Endpoint

**URL:** `GET https://api.anthropic.com/v1/models`

**Headers:**
```
x-api-key: YOUR_API_KEY
anthropic-version: 2023-06-01
```

**Response:**
```json
{
  "data": [
    {
      "id": "claude-3-5-haiku-20250101",
      "created_at": "2025-01-01T00:00:00Z",
      "display_name": "Claude 3.5 Haiku",
      "type": "model"
    }
  ],
  "has_more": false,
  "first_id": "...",
  "last_id": "..."
}
```

## Testing

The test files have been updated to use Haiku models for consistency:

- `tests/e2e/fixtures/mockAI.ts`: Updated mock responses
- `tests/e2e/06-error-handling.spec.ts`: Updated test assertions

Run tests with:
```bash
npm test
```

## Troubleshooting

### Issue: "No Haiku models available"

**Solution:**
- Check your API key has access to Claude models
- Verify network connectivity to `api.anthropic.com`
- Check if Anthropic has deprecated all Haiku models (unlikely)

### Issue: Cache not updating

**Solution:**
```typescript
import { ModelService } from './services/ai/modelService';

// Clear the cache manually
ModelService.clearCache();
```

### Issue: Want to force a specific model

**Solution:**
You can still use a specific model by modifying `getModel()` in `AnthropicService`:

```typescript
private async getModel(): Promise<string> {
  return 'claude-3-5-haiku-20241022'; // Force specific model
}
```

## Future Enhancements

Potential improvements:

1. **User Preferences**: Allow users to select their preferred model tier in the UI
2. **Model Metadata**: Display model info (name, capabilities) in the interface
3. **Cost Tracking**: Track and display estimated costs per model tier
4. **Fallback Strategy**: Auto-fallback to alternative model if preferred is unavailable
5. **Performance Monitoring**: Track response times and quality by model

## References

- [Anthropic Models API Documentation](https://docs.anthropic.com/en/api/models-list)
- [Claude Models Overview](https://docs.anthropic.com/en/docs/about-claude/models/overview)
- [Model Pricing](https://www.anthropic.com/pricing)
