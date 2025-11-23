import { Page, expect } from '@playwright/test';

/**
 * Helper functions for E2E tests
 */

export class TestHelper {
  constructor(private page: Page) {}

  /**
   * Set up the application with API key
   */
  async setupApp(apiKey = 'test-api-key-12345') {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');

    // Set API key in localStorage
    await this.page.evaluate((key) => {
      localStorage.setItem('config-storage', JSON.stringify({
        state: {
          config: {
            apiKey: btoa(key),
            fontSize: 14,
            contextLines: 10,
          },
        },
        version: 0,
      }));
    }, apiKey);

    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Clear all application state
   */
  async clearState() {
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Wait for Monaco editor to be ready
   */
  async waitForEditor() {
    await this.page.waitForSelector('.monaco-editor', { timeout: 10000 });
    await this.page.waitForTimeout(500); // Allow Monaco to fully initialize
  }

  /**
   * Set code in the Monaco editor
   */
  async setEditorContent(code: string) {
    await this.waitForEditor();

    // Focus the editor and select all
    await this.page.click('.monaco-editor');
    await this.page.keyboard.press('Control+A');

    // Type the new code
    await this.page.keyboard.type(code, { delay: 10 });

    // Wait for content to be set
    await this.page.waitForTimeout(300);
  }

  /**
   * Get current editor content
   */
  async getEditorContent(): Promise<string> {
    return await this.page.evaluate(() => {
      const model = (window as any).monaco?.editor?.getModels()?.[0];
      return model?.getValue() || '';
    });
  }

  /**
   * Select lines in the editor using Monaco's API
   */
  async selectLines(startLine: number, endLine: number = startLine) {
    await this.waitForEditor();

    // Use Monaco's API to set the selection
    await this.page.evaluate(({ start, end }) => {
      const editor = (window as any).monaco?.editor?.getEditors()?.[0];
      if (!editor) {
        throw new Error('Monaco editor not found');
      }

      // Set selection from start of startLine to end of endLine
      const selection = {
        startLineNumber: start,
        startColumn: 1,
        endLineNumber: end,
        endColumn: editor.getModel()?.getLineMaxColumn(end) || 1
      };

      editor.setSelection(selection);
      editor.revealLineInCenter(start);
    }, { start: startLine, end: endLine });

    // Wait for selection to be applied
    await this.page.waitForTimeout(100);
  }

  /**
   * Create a new thread on selected code
   */
  async createThread(question: string) {
    // Click "Ask AI" button
    await this.page.click('button:has-text("Ask AI")');

    // Wait for thread to be created and input to appear
    await this.page.waitForSelector('[data-testid="thread-input"]', { timeout: 5000 });

    // Type question
    await this.page.fill('[data-testid="thread-input"]', question);

    // Submit
    await this.page.click('button[type="submit"]:has-text("Send")');
  }

  /**
   * Wait for AI response to complete
   */
  async waitForAIResponse(timeout = 10000) {
    // Wait for loading spinner to disappear
    await this.page.waitForSelector('[data-testid="loading-spinner"]', {
      state: 'hidden',
      timeout
    });

    // Wait a bit for UI to update
    await this.page.waitForTimeout(300);
  }

  /**
   * Get all thread items
   */
  async getThreads() {
    return await this.page.locator('[data-testid="thread-item"]').all();
  }

  /**
   * Get active thread
   */
  async getActiveThread() {
    return await this.page.locator('[data-testid="thread-item"][data-active="true"]').first();
  }

  /**
   * Get messages in a thread
   */
  async getThreadMessages(threadIndex = 0) {
    const thread = (await this.getThreads())[threadIndex];
    if (!thread) return [];

    return await thread.locator('[data-testid="thread-message"]').all();
  }

  /**
   * Delete a thread
   */
  async deleteThread(threadIndex = 0) {
    const threads = await this.getThreads();
    const thread = threads[threadIndex];

    if (!thread) throw new Error(`Thread ${threadIndex} not found`);

    // Click delete button
    await thread.locator('button[aria-label="Delete thread"]').click();

    // Confirm deletion
    await this.page.click('button:has-text("Delete")');
  }

  /**
   * Resolve a thread
   */
  async resolveThread(threadIndex = 0) {
    const threads = await this.getThreads();
    const thread = threads[threadIndex];

    if (!thread) throw new Error(`Thread ${threadIndex} not found`);

    await thread.locator('button[aria-label="Resolve thread"]').click();
  }

  /**
   * Open settings modal
   */
  async openSettings() {
    await this.page.click('button[aria-label="Settings"]');
    await this.page.waitForSelector('[data-testid="settings-modal"]');
  }

  /**
   * Update settings
   */
  async updateSettings(settings: {
    apiKey?: string;
    fontSize?: number;
    contextLines?: number;
  }) {
    await this.openSettings();

    if (settings.apiKey !== undefined) {
      await this.page.fill('[data-testid="api-key-input"]', settings.apiKey);
    }

    if (settings.fontSize !== undefined) {
      await this.page.fill('[data-testid="font-size-input"]', settings.fontSize.toString());
    }

    if (settings.contextLines !== undefined) {
      await this.page.fill('[data-testid="context-lines-input"]', settings.contextLines.toString());
    }

    await this.page.click('button:has-text("Save")');
    await this.page.waitForSelector('[data-testid="settings-modal"]', { state: 'hidden' });
  }

  /**
   * Take a screenshot for visual comparison
   */
  async screenshot(name: string) {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true
    });
  }

  /**
   * Assert editor has syntax highlighting
   */
  async assertSyntaxHighlighting() {
    const hasHighlighting = await this.page.evaluate(() => {
      const editor = document.querySelector('.monaco-editor');
      if (!editor) return false;

      // Check for colored tokens (syntax highlighting)
      const tokens = editor.querySelectorAll('.mtk1, .mtk2, .mtk3, .mtk4, .mtk5, .mtk6');
      return tokens.length > 0;
    });

    expect(hasHighlighting).toBe(true);
  }

  /**
   * Assert thread has correct color
   */
  async assertThreadColor(threadIndex: number, expectedColorIndex: number) {
    const threads = await this.getThreads();
    const thread = threads[threadIndex];

    const colorClass = await thread.getAttribute('data-color');
    expect(colorClass).toBe(`thread-${expectedColorIndex}`);
  }

  /**
   * Get localStorage state
   */
  async getLocalStorage(key: string) {
    return await this.page.evaluate((k) => {
      const item = localStorage.getItem(k);
      return item ? JSON.parse(item) : null;
    }, key);
  }

  /**
   * Wait for network idle
   */
  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }
}
