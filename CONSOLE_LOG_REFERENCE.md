# Console Log Reference - Quick Guide

## Quick Diagnostics

Open Browser Console (F12) and look for these patterns:

## ✅ Everything Working

```
[AnthropicService] Initializing service...
[ModelService] Getting latest Haiku model...
[ModelService] Returning X cached models (age: XXs)
[ModelService] Found X Haiku models: claude-3-5-haiku-20241022, ...
[ModelService] Selected latest Haiku model: claude-3-5-haiku-20241022
[AnthropicService] Successfully initialized with model: claude-3-5-haiku-20241022
```

**What this means:** App is using the latest Haiku model from Anthropic's API.

---

## ⚠️ Fallback Active (API Unavailable)

```
[ModelService] Getting latest Haiku model...
[ModelService] Error fetching models: Failed to fetch
[ModelService] Failed to fetch Haiku model from API, using fallback
[ModelService] Using fallback model: claude-3-5-haiku-20241022
```

**What this means:**
- The Models API is unavailable (likely CORS issue in browser)
- App automatically fell back to a known working model
- **Everything still works** - you'll get code reviews

**Action needed:** None - this is expected in browser environments

---

## ❌ API Key Error

```
[ModelService] Response status: 401 Unauthorized
[ModelService] API Error Response: {"type":"authentication_error"...}
```

**What this means:** Your API key is invalid or expired

**Action needed:**
1. Check your API key in Settings
2. Verify it's active on https://console.anthropic.com
3. Remove any extra spaces

---

## ❌ Model Not Found Error

```
[AnthropicService] Anthropic API Error: {status: 404, message: "model: claude-..."}
```

**What this means:** The model doesn't exist or has been deprecated

**Action needed:**
- The fallback should have prevented this
- If you see this, the fallback model might also be deprecated
- Update the fallback model in `modelService.ts`

---

## 🔍 During Code Review

```
[AnthropicService] Starting streamCodeReview...
[AnthropicService] Using model: claude-3-5-haiku-20241022
[AnthropicService] Creating stream with model: claude-3-5-haiku-20241022
[AnthropicService] Stream created, processing chunks...
[AnthropicService] Stream completed successfully
```

**What this means:** Your code review request was processed successfully

---

## 📊 Response Details

```
[AnthropicService] Response received: {
  model: "claude-3-5-haiku-20241022",
  inputTokens: 1234,
  outputTokens: 567
}
```

**What this means:**
- Shows which model processed your request
- Shows token usage (useful for cost tracking)

---

## Filter Console Logs

### Show Only Errors
Click the **Errors** button in your browser console

### Show Only Model Service
Type in console filter: `[ModelService]`

### Show Only Anthropic Service
Type in console filter: `[AnthropicService]`

### Show Everything
Clear the filter box

---

## Common Issues & Quick Fixes

### "Failed to fetch"
- **Cause:** CORS restriction or network issue
- **Fix:** App uses fallback automatically - no action needed

### "401 Unauthorized"
- **Cause:** Invalid API key
- **Fix:** Update API key in Settings

### "404 Not Found"
- **Cause:** Model doesn't exist
- **Fix:** App should use fallback - report if persistent

### No logs appearing
- **Cause:** Console might be filtered
- **Fix:** Clear all console filters

---

## What To Report When Filing Issues

When reporting problems, include:

1. **Error message** from console
2. **Full log sequence** (copy from console)
3. **Which model** is being used (from logs)
4. **Network status** (check Network tab)
5. **API key status** (valid/invalid)

Example:
```
I'm seeing this in the console:
[ModelService] Error fetching models: Failed to fetch
[ModelService] Using fallback model: claude-3-5-haiku-20241022

Then when I try to get a review, I see:
[AnthropicService] Anthropic API Error: {status: 404, message: ...}
```

---

## Advanced: Disable Logging

To reduce console noise, comment out logs in:
- `src/services/ai/modelService.ts`
- `src/services/ai/anthropicClient.ts`

Search for `console.log`, `console.warn`, `console.error` and comment them out.

---

## Log Levels Explained

| Type | What It Means | Action Required |
|------|---------------|-----------------|
| `[ModelService] Getting...` | Normal operation | None |
| `[ModelService] Successfully...` | Success | None |
| `[ModelService] Using fallback` | Fallback active | Check why API failed (optional) |
| `[ModelService] Error...` | Something failed | Check error details |
| `[AnthropicService] Successfully...` | Success | None |
| `[AnthropicService] Error...` | API call failed | Check error details |

---

## Tips

- **Logs are your friend** - they show exactly what's happening
- **Fallback is normal** - especially in browser environments (CORS)
- **Red errors are not always bad** - if fallback works, you're fine
- **Check Network tab** - see actual HTTP requests/responses
- **Use console filters** - focus on relevant logs

---

## Performance

Logging has minimal impact:
- Each log: ~0.1-1ms
- Total per request: ~5-10ms
- Negligible compared to network latency (100-1000ms)

Safe to leave enabled in development.
