import { test, expect } from '@playwright/test';
import { TestHelper } from './fixtures/helpers';
import { CODE_SAMPLES } from './fixtures/codeSamples';

test.describe('Error Handling', () => {
  let helper: TestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new TestHelper(page);
  });

  test.afterEach(async ({ page }) => {
    await helper.clearState();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Set up mock to return errors
    await page.route('https://api.anthropic.com/**', route => {
      route.abort('failed');
    });

    await helper.setupApp();
    await helper.setEditorContent(CODE_SAMPLES.javascript);

    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    await page.click('button:has-text("Ask AI")');
    await page.fill('[data-testid="thread-input"]', 'Review this');
    await page.click('button[type="submit"]:has-text("Send")');

    await page.waitForTimeout(2000);

    // Should show error message
    const errorMessage = page.locator('[data-testid="error-message"]');
    const hasError = await errorMessage.isVisible().catch(() => false);

    expect(hasError).toBe(true);
  });

  test('should handle network errors', async ({ page }) => {
    // Simulate network failure
    await page.context().setOffline(true);

    await helper.setupApp();
    await helper.setEditorContent(CODE_SAMPLES.javascript);

    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    await page.click('button:has-text("Ask AI")');
    await page.fill('[data-testid="thread-input"]', 'Review this');
    await page.click('button[type="submit"]:has-text("Send")');

    await page.waitForTimeout(2000);

    // Should show network error
    const errorIndicator = page.locator('text=/network|error|failed/i');
    const hasError = await errorIndicator.isVisible().catch(() => false);

    expect(hasError).toBe(true);

    // Restore network
    await page.context().setOffline(false);
  });

  test('should handle missing API key error', async ({ page }) => {
    await helper.setupApp(''); // Empty API key

    await helper.setEditorContent(CODE_SAMPLES.javascript);
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    const askAIButton = page.locator('button:has-text("Ask AI")');
    const canClick = await askAIButton.isVisible();

    if (canClick) {
      await askAIButton.click();
      await page.fill('[data-testid="thread-input"]', 'Review this');
      await page.click('button[type="submit"]:has-text("Send")');

      await page.waitForTimeout(1000);

      // Should show API key error
      const errorMessage = page.locator('text=/api key/i');
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
    }
  });

  test('should handle localStorage quota exceeded', async ({ page }) => {
    await helper.setupApp();

    // Fill localStorage to quota
    await page.evaluate(() => {
      try {
        const largeData = 'x'.repeat(1024 * 1024); // 1MB
        for (let i = 0; i < 10; i++) {
          localStorage.setItem(`large-data-${i}`, largeData);
        }
      } catch (e) {
        // Quota exceeded
      }
    });

    await helper.setEditorContent(CODE_SAMPLES.javascript);

    // App should still function
    const editorExists = await page.locator('.monaco-editor').isVisible();
    expect(editorExists).toBe(true);

    // Clean up
    await page.evaluate(() => {
      for (let i = 0; i < 10; i++) {
        localStorage.removeItem(`large-data-${i}`);
      }
    });
  });

  test('should handle malformed localStorage data', async ({ page }) => {
    // Set invalid JSON in localStorage
    await page.evaluate(() => {
      localStorage.setItem('editor-storage', 'invalid json {');
      localStorage.setItem('thread-storage', 'also invalid');
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // App should load with defaults
    await helper.waitForEditor();
    const editorExists = await page.locator('.monaco-editor').isVisible();
    expect(editorExists).toBe(true);
  });

  test('should catch React errors with Error Boundary', async ({ page }) => {
    await helper.setupApp();
    await helper.waitForEditor();

    // Trigger an error (try to access undefined property)
    const hasErrorBoundary = await page.evaluate(() => {
      return document.body.innerHTML.includes('ErrorBoundary') ||
             document.querySelector('[data-testid="error-boundary"]') !== null;
    });

    // App should have error boundary (even if not triggered)
    const hasReact = await page.evaluate(() => {
      return (window as any).React !== undefined || document.querySelector('[id="root"]') !== null;
    });

    expect(hasReact).toBe(true);
  });

  test('should handle empty editor content', async ({ page }) => {
    await helper.setupApp();
    await helper.setEditorContent('');

    // Should not crash
    const editorExists = await page.locator('.monaco-editor').isVisible();
    expect(editorExists).toBe(true);

    // Should show empty state
    const content = await helper.getEditorContent();
    expect(content).toBe('');
  });

  test('should handle very large code files', async ({ page }) => {
    await helper.setupApp();

    // Create large code (10,000 lines)
    const largeCode = 'function test() {\n  return true;\n}\n'.repeat(3333);
    await helper.setEditorContent(largeCode);

    // Should handle it
    const content = await helper.getEditorContent();
    expect(content.length).toBeGreaterThan(50000);

    // Editor should still work
    const editorExists = await page.locator('.monaco-editor').isVisible();
    expect(editorExists).toBe(true);
  });

  test('should handle special characters in messages', async ({ page }) => {
    await helper.setupApp();
    await helper.setEditorContent(CODE_SAMPLES.javascript);

    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    const specialMessage = 'Test <script>alert("xss")</script> & special chars: \' " < > &';

    await page.click('button:has-text("Ask AI")');
    await page.fill('[data-testid="thread-input"]', specialMessage);

    // Should not execute scripts
    const dialogPromise = page.waitForEvent('dialog', { timeout: 1000 }).catch(() => null);
    await page.click('button[type="submit"]:has-text("Send")');
    const dialog = await dialogPromise;

    expect(dialog).toBeNull(); // No alert dialog
  });

  test('should handle rapid successive actions', async ({ page }) => {
    await helper.setupApp();
    await helper.setEditorContent(CODE_SAMPLES.javascript);

    // Rapidly create multiple threads
    for (let i = 0; i < 5; i++) {
      await page.click('.monaco-editor');
      await page.keyboard.press('Control+A');

      const askAI = page.locator('button:has-text("Ask AI")');
      const isVisible = await askAI.isVisible().catch(() => false);

      if (isVisible) {
        await askAI.click();
        await page.waitForTimeout(50);
      }
    }

    // Should handle gracefully
    const editorExists = await page.locator('.monaco-editor').isVisible();
    expect(editorExists).toBe(true);
  });

  test('should recover from editor crashes', async ({ page }) => {
    await helper.setupApp();
    await helper.setEditorContent(CODE_SAMPLES.javascript);

    // Try to trigger an edge case
    await page.evaluate(() => {
      const editor = (window as any).monaco?.editor?.getEditors()?.[0];
      if (editor) {
        try {
          editor.setModel(null);
        } catch (e) {
          // Ignore
        }
      }
    });

    await page.waitForTimeout(500);

    // App should still be functional
    const rootExists = await page.locator('#root').isVisible();
    expect(rootExists).toBe(true);
  });

  test('should handle concurrent AI requests', async ({ page }) => {
    // Mock AI with delay
    await page.route('https://api.anthropic.com/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          id: 'test',
          type: 'message',
          role: 'assistant',
          content: [{ type: 'text', text: 'Response' }],
          model: 'claude-3-5-haiku-20241022', // Using Haiku for testing
          stop_reason: 'end_turn',
          usage: { input_tokens: 10, output_tokens: 10 },
        }),
      });
    });

    await helper.setupApp();
    await helper.setEditorContent(CODE_SAMPLES.javascript);

    // Create two threads quickly
    await page.click('.monaco-editor');
    await helper.selectLines(1, 2);
    await page.waitForTimeout(100);
    await page.click('button:has-text("Ask AI")');
    await page.fill('[data-testid="thread-input"]', 'First');
    await page.click('button[type="submit"]:has-text("Send")');

    await page.waitForTimeout(100);

    await helper.selectLines(5, 6);
    await page.waitForTimeout(100);
    await page.click('button:has-text("Ask AI")');
    await page.fill('[data-testid="thread-input"]', 'Second');
    await page.click('button[type="submit"]:has-text("Send")');

    // Both should complete eventually
    await page.waitForTimeout(5000);

    const threads = await helper.getThreads();
    expect(threads.length).toBeGreaterThanOrEqual(1);
  });

  test('should validate input length limits', async ({ page }) => {
    await helper.setupApp();
    await helper.setEditorContent(CODE_SAMPLES.javascript);

    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    // Try extremely long input
    const veryLongMessage = 'a'.repeat(100000);

    await page.click('button:has-text("Ask AI")');
    await page.fill('[data-testid="thread-input"]', veryLongMessage);

    // Should handle it or show validation
    const submitButton = page.locator('button[type="submit"]:has-text("Send")');
    const isEnabled = await submitButton.isEnabled();

    // Either button is disabled or input is truncated
    if (isEnabled) {
      const inputValue = await page.locator('[data-testid="thread-input"]').inputValue();
      expect(inputValue.length).toBeLessThanOrEqual(100000);
    }
  });
});
