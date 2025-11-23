# Troubleshooting Guide

## Error: "Failed to fetch"

This error typically occurs when the application cannot connect to the Anthropic API to fetch the list of available models.

### Possible Causes and Solutions

### 1. CORS Issues (Browser Environment)

**Symptoms:**
- Console shows: `[ModelService] Error fetching models: Failed to fetch`
- Network tab shows CORS error
- Request to `https://api.anthropic.com/v1/models` is blocked

**Solution:**
The Models List API endpoint may not support CORS for browser-based requests. Since this is a browser app (`dangerouslyAllowBrowser: true`), the Models API might not be accessible.

**Workaround:**
The application now includes **automatic fallback** to a known working model. If the API fetch fails, it will use:
- Haiku: `claude-3-5-haiku-20241022`
- Sonnet: `claude-3-5-sonnet-20241022`
- Opus: `claude-3-opus-20240229`

### 2. Network Connectivity Issues

**Symptoms:**
- Console shows network errors
- Unable to reach `api.anthropic.com`

**Solution:**
- Check your internet connection
- Verify you can access `https://api.anthropic.com` in your browser
- Check if there's a firewall or proxy blocking the connection

### 3. Invalid API Key

**Symptoms:**
- Console shows: `[ModelService] Response status: 401 Unauthorized`
- API returns authentication error

**Solution:**
- Verify your API key is correct in the settings
- Check that your API key is active on https://console.anthropic.com
- Ensure there are no extra spaces or characters in the key

### 4. API Endpoint Unavailable

**Symptoms:**
- Console shows: `[ModelService] Response status: 404 Not Found`
- API endpoint doesn't exist

**Solution:**
The fallback mechanism will automatically use a known working model. No action needed.

## Console Logging

The application now includes comprehensive logging to help diagnose issues. Open your browser's Developer Console (F12) to see detailed logs:

### Model Service Logs

```
[ModelService] Fetching available models from Anthropic API...
[ModelService] Fetching page 1: https://api.anthropic.com/v1/models
[ModelService] Response status: 200 OK
[ModelService] Received 10 models on page 1
[ModelService] Models: claude-3-5-haiku-20241022, claude-3-5-sonnet-20241022, ...
[ModelService] Successfully fetched 10 total models
[ModelService] Getting latest Haiku model...
[ModelService] Found 2 Haiku models: claude-3-5-haiku-20241022, claude-3-haiku-20240307
[ModelService] Selected latest Haiku model: claude-3-5-haiku-20241022
```

### AnthropicService Logs

```
[AnthropicService] Initializing service...
[AnthropicService] Pre-fetching latest Haiku model...
[AnthropicService] Successfully initialized with model: claude-3-5-haiku-20241022
[AnthropicService] Starting streamCodeReview...
[AnthropicService] Using model: claude-3-5-haiku-20241022
[AnthropicService] Creating stream with model: claude-3-5-haiku-20241022
[AnthropicService] Stream created, processing chunks...
[AnthropicService] Stream completed successfully
```

### Error Logs

If something goes wrong, you'll see detailed error information:

```
[ModelService] Error fetching models: Error: Failed to fetch
[ModelService] Error message: Failed to fetch
[ModelService] Failed to fetch Haiku model from API, using fallback
[ModelService] Using fallback model: claude-3-5-haiku-20241022
```

## Understanding the Fallback Mechanism

The application is designed to be resilient. If it cannot fetch the latest models from the API, it will:

1. **Log the error** with detailed information
2. **Automatically fall back** to a known working model
3. **Continue operating** without requiring user intervention

This means:
- ✅ The app will work even if the Models API is unavailable
- ✅ You'll still get code reviews
- ✅ You'll see clear logs explaining what happened

## How to Read Console Logs

1. Open Developer Tools: `F12` or `Right-click > Inspect`
2. Go to the **Console** tab
3. Look for logs prefixed with:
   - `[ModelService]` - Model fetching and selection
   - `[AnthropicService]` - API requests and responses

## Common Log Patterns

### Successful Operation
```
✓ [ModelService] Fetching available models...
✓ [ModelService] Successfully fetched X models
✓ [ModelService] Selected latest Haiku model: claude-...
✓ [AnthropicService] Successfully initialized with model: claude-...
✓ [AnthropicService] Stream completed successfully
```

### Fallback Triggered
```
✗ [ModelService] Error fetching models: Failed to fetch
⚠ [ModelService] Failed to fetch Haiku model from API, using fallback
⚠ [ModelService] Using fallback model: claude-3-5-haiku-20241022
✓ [AnthropicService] Successfully initialized with model: claude-3-5-haiku-20241022
```

### API Error
```
✗ [AnthropicService] Error in streamCodeReview: Error
✗ [AnthropicService] Anthropic API Error: {status: 404, message: "model: claude-3-5-sonnet-20241022"}
```

## Forcing a Specific Model

If you need to bypass the automatic model selection and use a specific model:

1. Open `src/services/ai/anthropicClient.ts`
2. Modify the `getModel()` method:

```typescript
private async getModel(): Promise<string> {
  // Force a specific model
  return 'claude-3-5-haiku-20241022';
}
```

3. Rebuild: `npm run build`

## Clearing the Model Cache

The model list is cached for 1 hour. To force a refresh:

1. Open browser console
2. Run:
```javascript
// This will be available if you expose it in your app
ModelService.clearCache();
```

Or simply refresh the page after 1 hour.

## Still Having Issues?

If you're still experiencing problems:

1. **Check the console logs** - They contain detailed error information
2. **Verify your API key** - Ensure it's valid and active
3. **Check the fallback model** - The app should still work with the fallback
4. **Try a different browser** - Some browsers have stricter CORS policies
5. **Check Anthropic's status** - Visit https://status.anthropic.com

## Known Limitations

### Browser-Based CORS Restrictions

The Anthropic Models API (`/v1/models`) may not support CORS for browser-based requests. This is a security feature.

**Impact:**
- The automatic model fetching might not work in browser environments
- The fallback mechanism ensures the app still functions

**Alternative:**
If you need automatic model fetching, consider:
1. Using a backend proxy to fetch models
2. Building this as a server-side application instead
3. Relying on the fallback mechanism (recommended for now)

## Logging Levels

All logs are currently sent to `console.log`, `console.warn`, and `console.error`. You can filter them in your browser's console:

- **All logs**: Leave filters empty
- **Errors only**: Click "Errors" in the console toolbar
- **Specific service**: Filter by `[ModelService]` or `[AnthropicService]`

## Performance Impact

The logging adds minimal overhead:
- Logs are simple console statements
- Model fetching is cached for 1 hour
- Network requests only happen once per session (or on cache expiry)

For production, you may want to disable verbose logging by removing or commenting out `console.log` statements.
