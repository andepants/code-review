import { test, expect } from '@playwright/test';
import { TestHelper } from './fixtures/helpers';
import { CODE_SAMPLES } from './fixtures/codeSamples';
import { setupMockAI } from './fixtures/mockAI';

test.describe('AI Interaction', () => {
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

  test('should show loading state while waiting for AI', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    await page.click('button:has-text("Ask AI")');
    await page.fill('[data-testid="thread-input"]', 'Review this');
    await page.click('button[type="submit"]:has-text("Send")');

    // Loading spinner should appear
    const spinner = page.locator('[data-testid="loading-spinner"]');
    await expect(spinner).toBeVisible();
  });

  test('should receive contextual AI response', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    await helper.createThread('Review this function');
    await helper.waitForAIResponse();

    const aiMessage = page.locator('[data-testid="thread-message"][data-role="assistant"]').first();
    const content = await aiMessage.textContent();

    // AI response should have content
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(20);
  });

  test('should handle different types of questions', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    // Security question
    await helper.createThread('Are there any security issues?');
    await helper.waitForAIResponse();

    const messages = await helper.getThreadMessages(0);
    expect(messages.length).toBeGreaterThanOrEqual(2);
  });

  test('should support follow-up questions', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    // First question
    await helper.createThread('Review this code');
    await helper.waitForAIResponse();

    // Follow-up
    await page.fill('[data-testid="thread-input"]', 'Can you explain more?');
    await page.click('button[type="submit"]:has-text("Send")');
    await helper.waitForAIResponse();

    const messages = await helper.getThreadMessages(0);
    expect(messages.length).toBeGreaterThanOrEqual(4);
  });

  test('should include code context in AI request', async ({ page }) => {
    await helper.setEditorContent(CODE_SAMPLES.javascript);

    // Select middle section
    await helper.selectLines(2, 4);
    await page.waitForTimeout(300);

    await helper.createThread('What does this do?');
    await helper.waitForAIResponse();

    // Should receive response
    const messages = await helper.getThreadMessages(0);
    expect(messages.length).toBeGreaterThanOrEqual(2);
  });

  test('should disable input while AI is responding', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    await page.click('button:has-text("Ask AI")');
    await page.fill('[data-testid="thread-input"]', 'Review this');
    await page.click('button[type="submit"]:has-text("Send")');

    // Input should be disabled
    const input = page.locator('[data-testid="thread-input"]');
    const isDisabled = await input.isDisabled();
    expect(isDisabled).toBe(true);
  });

  test('should re-enable input after AI response', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    await helper.createThread('Review this');
    await helper.waitForAIResponse();

    // Input should be enabled again
    const input = page.locator('[data-testid="thread-input"]');
    const isDisabled = await input.isDisabled();
    expect(isDisabled).toBe(false);
  });

  test('should validate empty messages', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    await page.click('button:has-text("Ask AI")');

    // Try to send empty message
    await page.fill('[data-testid="thread-input"]', '');
    await page.click('button[type="submit"]:has-text("Send")');

    await page.waitForTimeout(300);

    // Should not create message
    const messages = await helper.getThreadMessages(0);
    expect(messages.length).toBe(0);
  });

  test('should handle long messages', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    const longMessage = 'Please review this code. '.repeat(50);
    await helper.createThread(longMessage);
    await helper.waitForAIResponse();

    const userMessage = page.locator('[data-testid="thread-message"][data-role="user"]').first();
    const content = await userMessage.textContent();
    expect(content).toContain('Please review this code');
  });

  test('should show message timestamps', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    await helper.createThread('Review this');
    await helper.waitForAIResponse();

    // Messages should have timestamps
    const timestamp = page.locator('[data-testid="message-timestamp"]').first();
    await expect(timestamp).toBeVisible();
  });

  test('should preserve message history', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    await helper.createThread('First message');
    await helper.waitForAIResponse();

    // Add second message
    await page.fill('[data-testid="thread-input"]', 'Second message');
    await page.click('button[type="submit"]:has-text("Send")');
    await helper.waitForAIResponse();

    // Both messages should be visible
    const userMessages = await page.locator('[data-testid="thread-message"][data-role="user"]').count();
    expect(userMessages).toBeGreaterThanOrEqual(2);
  });

  test('should scroll to new messages', async ({ page }) => {
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    // Create several messages
    for (let i = 0; i < 3; i++) {
      if (i === 0) {
        await helper.createThread(`Message ${i + 1}`);
      } else {
        await page.fill('[data-testid="thread-input"]', `Message ${i + 1}`);
        await page.click('button[type="submit"]:has-text("Send")');
      }
      await helper.waitForAIResponse();
    }

    // Last message should be in view
    const lastMessage = page.locator('[data-testid="thread-message"]').last();
    await expect(lastMessage).toBeInViewport();
  });
});
