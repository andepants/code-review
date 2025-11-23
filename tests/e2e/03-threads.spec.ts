import { test, expect } from '@playwright/test';
import { TestHelper } from './fixtures/helpers';
import { CODE_SAMPLES } from './fixtures/codeSamples';
import { setupMockAI } from './fixtures/mockAI';

test.describe('Thread Management', () => {
  let helper: TestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new TestHelper(page);
    await setupMockAI(page);
    await helper.setupApp();
    await helper.setEditorContent(CODE_SAMPLES.javascript);
  });

  test.afterEach(async ({ page }) => {
    await helper.clearState();
  });

  test('should create a new thread on selected code', async ({ page }) => {
    // Select code
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    // Click "Ask AI"
    await page.click('button:has-text("Ask AI")');

    // Thread panel should show new thread
    const threads = await helper.getThreads();
    expect(threads.length).toBe(1);
  });

  test('should show thread input after creating thread', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    await page.click('button:has-text("Ask AI")');

    // Input should be visible
    const input = page.locator('[data-testid="thread-input"]');
    await expect(input).toBeVisible();
  });

  test('should send message in thread', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    await helper.createThread('Review this function');

    // Wait for AI response
    await helper.waitForAIResponse();

    // Should have user and AI messages
    const messages = await helper.getThreadMessages(0);
    expect(messages.length).toBeGreaterThanOrEqual(2);
  });

  test('should display user message correctly', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    const question = 'Review this function';
    await helper.createThread(question);

    await page.waitForTimeout(500);

    // Check user message
    const userMessage = page.locator('[data-testid="thread-message"][data-role="user"]').first();
    await expect(userMessage).toContainText(question);
  });

  test('should display AI response correctly', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    await helper.createThread('Review this function');
    await helper.waitForAIResponse();

    // Check AI message
    const aiMessage = page.locator('[data-testid="thread-message"][data-role="assistant"]').first();
    await expect(aiMessage).toBeVisible();

    const content = await aiMessage.textContent();
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(10);
  });

  test('should support multiple threads', async ({ page }) => {
    // Create first thread
    await page.click('.monaco-editor');
    await helper.selectLines(1, 3);
    await page.waitForTimeout(300);
    await helper.createThread('Review lines 1-3');
    await helper.waitForAIResponse();

    // Create second thread
    await helper.selectLines(5, 7);
    await page.waitForTimeout(300);
    await helper.createThread('Review lines 5-7');
    await helper.waitForAIResponse();

    // Should have 2 threads
    const threads = await helper.getThreads();
    expect(threads.length).toBe(2);
  });

  test('should assign different colors to threads', async ({ page }) => {
    // Create first thread
    await page.click('.monaco-editor');
    await helper.selectLines(1, 2);
    await page.waitForTimeout(300);
    await helper.createThread('First thread');
    await helper.waitForAIResponse();

    // Create second thread
    await helper.selectLines(5, 6);
    await page.waitForTimeout(300);
    await helper.createThread('Second thread');
    await helper.waitForAIResponse();

    // Threads should have different colors
    const threads = await helper.getThreads();
    const color1 = await threads[0].getAttribute('data-color');
    const color2 = await threads[1].getAttribute('data-color');

    expect(color1).not.toBe(color2);
  });

  test('should highlight code with thread color', async ({ page }) => {
    await page.click('.monaco-editor');
    await helper.selectLines(1, 3);
    await page.waitForTimeout(300);
    await helper.createThread('Review this');
    await helper.waitForAIResponse();

    // Editor should have decorations
    const hasDecorations = await page.evaluate(() => {
      const editor = (window as any).monaco?.editor?.getEditors()?.[0];
      const decorations = editor?.getModel()?.getAllDecorations();
      return decorations && decorations.length > 0;
    });

    expect(hasDecorations).toBe(true);
  });

  test('should show gutter markers for threads', async ({ page }) => {
    await page.click('.monaco-editor');
    await helper.selectLines(1, 3);
    await page.waitForTimeout(300);
    await helper.createThread('Review this');
    await helper.waitForAIResponse();

    // Check for gutter markers
    const gutterMarkers = await page.locator('.thread-glyph').count();
    expect(gutterMarkers).toBeGreaterThan(0);
  });

  test('should set thread as active when created', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);
    await helper.createThread('Review this');
    await helper.waitForAIResponse();

    // Thread should be active
    const activeThread = await helper.getActiveThread();
    expect(activeThread).toBeTruthy();
  });

  test('should switch active thread on click', async ({ page }) => {
    // Create two threads
    await page.click('.monaco-editor');
    await helper.selectLines(1, 2);
    await page.waitForTimeout(300);
    await helper.createThread('First');
    await helper.waitForAIResponse();

    await helper.selectLines(5, 6);
    await page.waitForTimeout(300);
    await helper.createThread('Second');
    await helper.waitForAIResponse();

    // Click first thread
    const threads = await helper.getThreads();
    await threads[0].click();
    await page.waitForTimeout(200);

    // First thread should be active
    const activeThread = await helper.getActiveThread();
    const firstThreadActive = await threads[0].getAttribute('data-active');
    expect(firstThreadActive).toBe('true');
  });

  test('should resolve a thread', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);
    await helper.createThread('Review this');
    await helper.waitForAIResponse();

    // Resolve thread
    await helper.resolveThread(0);
    await page.waitForTimeout(300);

    // Thread should show as resolved
    const threads = await helper.getThreads();
    const status = await threads[0].getAttribute('data-status');
    expect(status).toBe('resolved');
  });

  test('should reopen a resolved thread', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);
    await helper.createThread('Review this');
    await helper.waitForAIResponse();

    // Resolve thread
    await helper.resolveThread(0);
    await page.waitForTimeout(300);

    // Reopen thread
    const threads = await helper.getThreads();
    await threads[0].locator('button[aria-label="Reopen thread"]').click();
    await page.waitForTimeout(300);

    // Thread should be active again
    const status = await threads[0].getAttribute('data-status');
    expect(status).toBe('active');
  });

  test('should delete a thread', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);
    await helper.createThread('Review this');
    await helper.waitForAIResponse();

    // Delete thread
    await helper.deleteThread(0);
    await page.waitForTimeout(300);

    // Thread should be gone
    const threads = await helper.getThreads();
    expect(threads.length).toBe(0);
  });

  test('should persist threads in localStorage', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);
    await helper.createThread('Review this');
    await helper.waitForAIResponse();

    // Wait for persistence
    await page.waitForTimeout(500);

    // Reload page
    await page.reload();
    await helper.waitForEditor();

    // Thread should be restored
    const threads = await helper.getThreads();
    expect(threads.length).toBe(1);
  });

  test('should handle creating thread with no code selected', async ({ page }) => {
    await helper.setEditorContent('');

    // Try to create thread without selection
    const askAIButton = page.locator('button:has-text("Ask AI")');
    const isVisible = await askAIButton.isVisible().catch(() => false);

    // Button should not be visible without selection
    expect(isVisible).toBe(false);
  });

  test('should show conversation history in thread', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    // First message
    await helper.createThread('First question');
    await helper.waitForAIResponse();

    // Second message in same thread
    await page.fill('[data-testid="thread-input"]', 'Follow-up question');
    await page.click('button[type="submit"]:has-text("Send")');
    await helper.waitForAIResponse();

    // Should have 4 messages (2 user, 2 AI)
    const messages = await helper.getThreadMessages(0);
    expect(messages.length).toBeGreaterThanOrEqual(4);
  });

  test('should limit number of threads', async ({ page }) => {
    // Try to create 51 threads (limit is 50)
    for (let i = 0; i < 51; i++) {
      await page.click('.monaco-editor');
      await helper.selectLines(1, 2);
      await page.waitForTimeout(100);

      // Check if we can still create threads
      const askAIButton = page.locator('button:has-text("Ask AI")');
      const canCreate = await askAIButton.isVisible().catch(() => false);

      if (canCreate) {
        await askAIButton.click();
        await page.waitForTimeout(100);
      } else {
        break;
      }
    }

    const threads = await helper.getThreads();
    expect(threads.length).toBeLessThanOrEqual(50);
  });
});
