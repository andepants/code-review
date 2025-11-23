import { test, expect } from '@playwright/test';
import { TestHelper } from './fixtures/helpers';
import { CODE_SAMPLES } from './fixtures/codeSamples';

test.describe('Code Selection', () => {
  let helper: TestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new TestHelper(page);
    await helper.setupApp();
    await helper.setEditorContent(CODE_SAMPLES.javascript);
  });

  test.afterEach(async ({ page }) => {
    await helper.clearState();
  });

  test('should allow selecting a single line', async ({ page }) => {
    // Select line 1
    await helper.selectLines(1);

    // Selection should be active
    const selection = await page.evaluate(() => {
      const model = (window as any).monaco?.editor?.getModels()?.[0];
      const editor = (window as any).monaco?.editor?.getEditors()?.[0];
      return editor?.getSelection();
    });

    expect(selection).toBeDefined();
    expect(selection.startLineNumber).toBe(1);
  });

  test('should allow selecting multiple lines', async ({ page }) => {
    // Select lines 1-5
    await helper.selectLines(1, 5);

    const selection = await page.evaluate(() => {
      const editor = (window as any).monaco?.editor?.getEditors()?.[0];
      return editor?.getSelection();
    });

    expect(selection).toBeDefined();
    expect(selection.startLineNumber).toBeLessThanOrEqual(5);
  });

  test('should show "Ask AI" button when code is selected', async ({ page }) => {
    // No selection initially
    let askAIButton = page.locator('button:has-text("Ask AI")');
    let isVisible = await askAIButton.isVisible().catch(() => false);
    expect(isVisible).toBe(false);

    // Select some code
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');

    // Wait a bit for UI to update
    await page.waitForTimeout(300);

    // "Ask AI" button should appear in thread panel
    askAIButton = page.locator('button:has-text("Ask AI")');
    isVisible = await askAIButton.isVisible();
    expect(isVisible).toBe(true);
  });

  test('should handle text selection via mouse', async ({ page }) => {
    await helper.waitForEditor();

    // Click and drag to select
    const editor = page.locator('.monaco-editor');
    await editor.click({ position: { x: 50, y: 50 } });
    await page.mouse.down();
    await page.mouse.move(200, 100);
    await page.mouse.up();

    await page.waitForTimeout(200);

    const selection = await page.evaluate(() => {
      const editor = (window as any).monaco?.editor?.getEditors()?.[0];
      return editor?.getSelection();
    });

    expect(selection).toBeDefined();
  });

  test('should handle keyboard selection', async ({ page }) => {
    await page.click('.monaco-editor');

    // Move to start
    await page.keyboard.press('Control+Home');

    // Select 5 lines
    await page.keyboard.down('Shift');
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('ArrowDown');
    }
    await page.keyboard.up('Shift');

    const selection = await page.evaluate(() => {
      const editor = (window as any).monaco?.editor?.getEditors()?.[0];
      return editor?.getSelection();
    });

    expect(selection).toBeDefined();
    expect(selection.endLineNumber).toBeGreaterThan(selection.startLineNumber);
  });

  test('should clear selection when clicking elsewhere', async ({ page }) => {
    // Select code
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');

    await page.waitForTimeout(200);

    // Click elsewhere in editor
    await page.click('.monaco-editor', { position: { x: 50, y: 50 } });

    await page.waitForTimeout(200);

    const selection = await page.evaluate(() => {
      const editor = (window as any).monaco?.editor?.getEditors()?.[0];
      const sel = editor?.getSelection();
      return {
        isEmpty: sel?.isEmpty(),
        selection: sel
      };
    });

    // Selection should be collapsed (cursor position)
    expect(selection.isEmpty).toBe(true);
  });

  test('should handle selection with empty code', async ({ page }) => {
    // Clear all code
    await helper.setEditorContent('');

    // Try to select
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');

    // Should not crash
    const editorExists = await page.locator('.monaco-editor').isVisible();
    expect(editorExists).toBe(true);
  });

  test('should preserve selection state', async ({ page }) => {
    // Select code
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');

    await page.waitForTimeout(200);

    const initialSelection = await page.evaluate(() => {
      const editor = (window as any).monaco?.editor?.getEditors()?.[0];
      return editor?.getSelection();
    });

    // Click in thread panel (not the editor)
    await page.click('[data-testid="thread-panel"]');

    await page.waitForTimeout(200);

    const afterSelection = await page.evaluate(() => {
      const editor = (window as any).monaco?.editor?.getEditors()?.[0];
      return editor?.getSelection();
    });

    // Selection should be preserved
    expect(initialSelection).toEqual(afterSelection);
  });
});
