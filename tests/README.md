# Test Suite - AI-Powered Code Review Assistant

## Overview

This directory contains a comprehensive end-to-end (E2E) test suite for the AI-Powered Code Review Assistant application, built with Playwright.

## Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Run all tests
npm test

# Run tests with UI (recommended for first time)
npm run test:ui

# Run smoke tests only
npx playwright test tests/e2e/00-smoke.spec.ts
```

## Test Structure

```
tests/
├── e2e/
│   ├── fixtures/
│   │   ├── mockAI.ts         # AI response mocking
│   │   ├── codeSamples.ts    # Test code samples
│   │   └── helpers.ts        # Test helper functions
│   ├── 00-smoke.spec.ts      # Smoke tests (quick validation)
│   ├── 01-editor.spec.ts     # Editor functionality
│   ├── 02-selection.spec.ts  # Code selection
│   ├── 03-threads.spec.ts    # Thread management
│   ├── 04-ai-interaction.spec.ts  # AI integration
│   ├── 05-configuration.spec.ts   # Settings
│   ├── 06-error-handling.spec.ts  # Error scenarios
│   └── 07-responsive-design.spec.ts  # Responsive layout
└── README.md                 # This file
```

## Test Categories

### 1. Smoke Tests (4 tests)
Quick validation that application loads and core components are present.

**Run:** `npx playwright test tests/e2e/00-smoke.spec.ts`

### 2. Code Editor Interface (15 tests)
Tests Monaco editor integration, syntax highlighting, and editing functionality.

**Run:** `npx playwright test tests/e2e/01-editor.spec.ts`

**Coverage:**
- Editor initialization
- Syntax highlighting (JavaScript, TypeScript, Python)
- Code input/editing
- Language selection
- Persistence
- Special characters

### 3. Code Selection (8 tests)
Tests code selection mechanisms and UI feedback.

**Run:** `npx playwright test tests/e2e/02-selection.spec.ts`

**Coverage:**
- Single/multi-line selection
- Mouse and keyboard selection
- Selection state management

### 4. Thread Management (18 tests)
Tests thread lifecycle, visual indicators, and operations.

**Run:** `npx playwright test tests/e2e/03-threads.spec.ts`

**Coverage:**
- Thread creation/deletion
- Multiple threads
- Thread colors (8 colors)
- Thread resolution
- Gutter markers
- Thread persistence

### 5. AI Interaction (12 tests)
Tests AI integration with mocked responses.

**Run:** `npx playwright test tests/e2e/04-ai-interaction.spec.ts`

**Coverage:**
- AI responses
- Conversation flow
- Follow-up questions
- Loading states
- Message history

### 6. Configuration & Settings (15 tests)
Tests application settings and configuration.

**Run:** `npx playwright test tests/e2e/05-configuration.spec.ts`

**Coverage:**
- API key management
- Font size (10-24px)
- Context lines (5-50)
- Settings persistence
- Validation

### 7. Error Handling (14 tests)
Tests error scenarios and recovery mechanisms.

**Run:** `npx playwright test tests/e2e/06-error-handling.spec.ts`

**Coverage:**
- API errors
- Network errors
- Storage errors
- XSS prevention
- Graceful degradation

### 8. Responsive Design (13 tests)
Tests responsive layout across devices.

**Run:** `npx playwright test tests/e2e/07-responsive-design.spec.ts`

**Coverage:**
- Desktop (1920x1080, 1280x720)
- Tablet (768x1024)
- Mobile (375x667)
- Ultrawide (3440x1440)

## Test Helpers

The `TestHelper` class provides utilities for common test operations:

```typescript
// Setup
await helper.setupApp();           // Initialize with mock API key
await helper.clearState();         // Clear storage

// Editor
await helper.setEditorContent(code);
const content = await helper.getEditorContent();
await helper.selectLines(1, 5);

// Threads
await helper.createThread('Review this');
await helper.waitForAIResponse();
const threads = await helper.getThreads();
await helper.deleteThread(0);
await helper.resolveThread(0);

// Settings
await helper.openSettings();
await helper.updateSettings({ fontSize: 16 });

// Debugging
await helper.screenshot('test-name');
```

## Mock AI Responses

Tests use deterministic AI responses for reliability:

```typescript
// In tests
import { setupMockAI } from './fixtures/mockAI';

test.beforeEach(async ({ page }) => {
  await setupMockAI(page);  // Mock API calls
});
```

Response types:
- Security reviews
- Performance analysis
- Code explanations
- Follow-up responses
- Error scenarios

## Running Tests

### All Tests
```bash
npm test
```

### Specific Browser
```bash
npm run test:chromium  # Chrome
npm run test:firefox   # Firefox
npm run test:webkit    # Safari
```

### Specific Test File
```bash
npx playwright test tests/e2e/01-editor.spec.ts
```

### Specific Test
```bash
npx playwright test -g "should load Monaco editor"
```

### Debug Mode
```bash
npm run test:debug
```

### UI Mode (Interactive)
```bash
npm run test:ui
```

### Headed (Visible Browser)
```bash
npm run test:headed
```

## Test Reports

After running tests, view the HTML report:

```bash
npm run test:report
```

Reports include:
- Test results
- Screenshots (on failure)
- Videos (on failure)
- Traces (on retry)

## Writing New Tests

### Template

```typescript
import { test, expect } from '@playwright/test';
import { TestHelper } from './fixtures/helpers';
import { setupMockAI } from './fixtures/mockAI';

test.describe('Feature Name', () => {
  let helper: TestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new TestHelper(page);
    await setupMockAI(page);  // If testing AI features
    await helper.setupApp();
  });

  test.afterEach(async ({ page }) => {
    await helper.clearState();
  });

  test('should do something', async ({ page }) => {
    // Test logic here
    expect(something).toBe(true);
  });
});
```

### Best Practices

1. **Isolation:** Each test should be independent
2. **Cleanup:** Always clear state in `afterEach`
3. **Helpers:** Use `TestHelper` for common operations
4. **Mocking:** Mock AI responses for deterministic tests
5. **Naming:** Use descriptive test names starting with "should"
6. **Waits:** Use `waitForTimeout` sparingly, prefer selectors
7. **Assertions:** Use Playwright's expect for better error messages

## Debugging Tips

### Test Failures

1. **Run in headed mode:**
   ```bash
   npm run test:headed
   ```

2. **Enable debug mode:**
   ```bash
   npm run test:debug
   ```

3. **Check screenshots:**
   ```
   test-results/screenshots/
   ```

4. **Review traces:**
   Open trace files in Playwright's trace viewer

### Common Issues

**Monaco not loading:**
- Increase timeout in `waitForEditor()`
- Check network tab for failed requests

**Selection not working:**
- Ensure editor is fully initialized
- Add small wait after selection

**Flaky tests:**
- Add retry in CI
- Use more specific selectors
- Increase timeouts for slow operations

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci --legacy-peer-deps

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run tests
        run: npm test

      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: test-results/
```

## Coverage

### Functional Requirements: 100%
- Code Editor: ✅ 8/8
- Thread Management: ✅ 18/18
- AI Conversations: ✅ 18/18
- Polish & UX: ✅ 21/21

### Browser Coverage
- ✅ Chromium (Chrome, Edge)
- ✅ Firefox
- ✅ WebKit (Safari)

### Device Coverage
- ✅ Desktop (multiple resolutions)
- ✅ Tablet
- ✅ Mobile

## Maintenance

### Updating Tests

When application changes:
1. Update affected test specs
2. Update helpers if needed
3. Update code samples if needed
4. Update this documentation
5. Run full suite to verify

### Adding Code Samples

Add new samples to `fixtures/codeSamples.ts`:

```typescript
export const CODE_SAMPLES = {
  // ...existing samples
  newLanguage: `code here`,
};
```

### Adding Mock Responses

Add new responses to `fixtures/mockAI.ts`:

```typescript
export const MOCK_RESPONSES = {
  // ...existing responses
  'new-scenario': {
    delay: 100,
    content: 'Response text',
  },
};
```

## Performance

- **Full Suite:** ~30-60 seconds
- **Parallel:** Yes (configurable)
- **Retries:** 0 local, 2 CI
- **Workers:** Auto (local), 1 (CI)

## Documentation

- **Test Suite Docs:** `/TEST_SUITE_DOCUMENTATION.md`
- **Playwright Docs:** https://playwright.dev
- **This README:** Current file

## Support

For issues or questions:
1. Check test output and artifacts
2. Run in debug mode
3. Review documentation
4. Check Playwright docs

---

**Version:** 1.0.0
**Last Updated:** November 21, 2025
**Status:** ✅ Complete
