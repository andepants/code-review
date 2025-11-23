import { test, expect } from '@playwright/test';
import { TestHelper } from './fixtures/helpers';
import { CODE_SAMPLES } from './fixtures/codeSamples';

test.describe('Code Editor Interface', () => {
  let helper: TestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new TestHelper(page);
    await helper.setupApp();
  });

  test.afterEach(async ({ page }) => {
    await helper.clearState();
  });

  test('should load Monaco editor successfully', async ({ page }) => {
    await helper.waitForEditor();

    const editorExists = await page.locator('.monaco-editor').isVisible();
    expect(editorExists).toBe(true);
  });

  test('should display empty state message', async ({ page }) => {
    await helper.waitForEditor();

    const content = await helper.getEditorContent();
    expect(content).toBe('');
  });

  test('should allow typing code', async ({ page }) => {
    const testCode = CODE_SAMPLES.javascript;
    await helper.setEditorContent(testCode);

    const content = await helper.getEditorContent();
    expect(content).toContain('calculateTotal');
    expect(content).toContain('items');
  });

  test('should apply syntax highlighting for JavaScript', async ({ page }) => {
    await helper.setEditorContent(CODE_SAMPLES.javascript);
    await page.waitForTimeout(500); // Allow syntax highlighting to apply

    await helper.assertSyntaxHighlighting();
  });

  test('should apply syntax highlighting for TypeScript', async ({ page }) => {
    await helper.setEditorContent(CODE_SAMPLES.typescript);
    await page.waitForTimeout(500);

    await helper.assertSyntaxHighlighting();
  });

  test('should apply syntax highlighting for Python', async ({ page }) => {
    await helper.setEditorContent(CODE_SAMPLES.python);
    await page.waitForTimeout(500);

    await helper.assertSyntaxHighlighting();
  });

  test('should show line numbers', async ({ page }) => {
    await helper.setEditorContent(CODE_SAMPLES.javascript);

    const lineNumbers = await page.locator('.line-numbers').count();
    expect(lineNumbers).toBeGreaterThan(0);
  });

  test('should handle empty code gracefully', async ({ page }) => {
    await helper.setEditorContent('');

    const content = await helper.getEditorContent();
    expect(content).toBe('');

    // Should not crash
    const editorExists = await page.locator('.monaco-editor').isVisible();
    expect(editorExists).toBe(true);
  });

  test('should handle very long code', async ({ page }) => {
    await helper.setEditorContent(CODE_SAMPLES.long_code);

    const content = await helper.getEditorContent();
    expect(content.length).toBeGreaterThan(500);

    // Editor should still be responsive
    const editorExists = await page.locator('.monaco-editor').isVisible();
    expect(editorExists).toBe(true);
  });

  test('should update language selector when code changes', async ({ page }) => {
    // Start with JavaScript
    await helper.setEditorContent(CODE_SAMPLES.javascript);
    await page.waitForTimeout(500);

    // Language selector should show JavaScript
    const languageButton = page.locator('[data-testid="language-selector"]');
    const language = await languageButton.textContent();
    expect(language?.toLowerCase()).toContain('javascript');
  });

  test('should support manual language selection', async ({ page }) => {
    await helper.setEditorContent(CODE_SAMPLES.javascript);

    // Open language selector
    await page.click('[data-testid="language-selector"]');

    // Select Python
    await page.click('button:has-text("Python")');

    // Verify language changed
    const languageButton = page.locator('[data-testid="language-selector"]');
    const language = await languageButton.textContent();
    expect(language?.toLowerCase()).toContain('python');
  });

  test('should persist code in localStorage', async ({ page }) => {
    const testCode = CODE_SAMPLES.javascript;
    await helper.setEditorContent(testCode);

    // Wait for state to persist
    await page.waitForTimeout(500);

    // Reload page
    await page.reload();
    await helper.waitForEditor();

    // Code should be restored
    const content = await helper.getEditorContent();
    expect(content).toContain('calculateTotal');
  });

  test('should handle special characters', async ({ page }) => {
    const specialCode = 'const regex = /[a-z]+/g;\nconst emoji = "🚀";';
    await helper.setEditorContent(specialCode);

    const content = await helper.getEditorContent();
    expect(content).toContain('🚀');
    expect(content).toContain('/[a-z]+/g');
  });

  test('should support copy/paste', async ({ page }) => {
    const testCode = CODE_SAMPLES.short;
    await helper.setEditorContent(testCode);

    // Select all and copy
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');

    // Clear editor
    await page.keyboard.press('Backspace');

    // Paste
    await page.keyboard.press('Control+V');

    const content = await helper.getEditorContent();
    expect(content).toContain('Hello, World!');
  });

  test('should show current line highlight', async ({ page }) => {
    await helper.setEditorContent(CODE_SAMPLES.javascript);

    // Click in the editor
    await page.click('.monaco-editor');

    // Current line should be highlighted
    const currentLineHighlight = await page.locator('.current-line').isVisible();
    expect(currentLineHighlight).toBe(true);
  });
});
