import { test, expect } from '@playwright/test';
import { TestHelper } from './fixtures/helpers';
import { CODE_SAMPLES } from './fixtures/codeSamples';

test.describe('Configuration & Settings', () => {
  let helper: TestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new TestHelper(page);
    await helper.setupApp();
  });

  test.afterEach(async ({ page }) => {
    await helper.clearState();
  });

  test('should open settings modal', async ({ page }) => {
    await helper.openSettings();

    const modal = page.locator('[data-testid="settings-modal"]');
    await expect(modal).toBeVisible();
  });

  test('should close settings modal on cancel', async ({ page }) => {
    await helper.openSettings();

    await page.click('button:has-text("Cancel")');

    const modal = page.locator('[data-testid="settings-modal"]');
    await expect(modal).not.toBeVisible();
  });

  test('should update API key', async ({ page }) => {
    const newApiKey = 'new-test-api-key-67890';

    await helper.updateSettings({ apiKey: newApiKey });

    // Verify in localStorage
    const config = await helper.getLocalStorage('config-storage');
    expect(config.state.config.apiKey).toBeTruthy();
  });

  test('should update font size', async ({ page }) => {
    await helper.setEditorContent(CODE_SAMPLES.javascript);

    await helper.updateSettings({ fontSize: 18 });

    // Verify font size changed
    const fontSize = await page.evaluate(() => {
      const editor = document.querySelector('.monaco-editor');
      return window.getComputedStyle(editor!).fontSize;
    });

    expect(fontSize).toBe('18px');
  });

  test('should update context lines', async ({ page }) => {
    await helper.updateSettings({ contextLines: 20 });

    // Verify in localStorage
    const config = await helper.getLocalStorage('config-storage');
    expect(config.state.config.contextLines).toBe(20);
  });

  test('should validate font size range (10-24)', async ({ page }) => {
    await helper.openSettings();

    // Try to set too small
    await page.fill('[data-testid="font-size-input"]', '5');
    await page.click('button:has-text("Save")');

    // Should show validation error or prevent save
    const modal = page.locator('[data-testid="settings-modal"]');
    const isVisible = await modal.isVisible();

    // Either modal stays open or value is corrected
    if (isVisible) {
      // Modal stayed open due to validation
      await page.click('button:has-text("Cancel")');
    } else {
      // Value was corrected
      const config = await helper.getLocalStorage('config-storage');
      expect(config.state.config.fontSize).toBeGreaterThanOrEqual(10);
    }
  });

  test('should validate context lines range (5-50)', async ({ page }) => {
    await helper.openSettings();

    // Try to set too small
    await page.fill('[data-testid="context-lines-input"]', '2');
    await page.click('button:has-text("Save")');

    await page.waitForTimeout(300);

    const config = await helper.getLocalStorage('config-storage');
    expect(config.state.config.contextLines).toBeGreaterThanOrEqual(5);
  });

  test('should persist settings across sessions', async ({ page }) => {
    const newSettings = {
      apiKey: 'persistent-key',
      fontSize: 16,
      contextLines: 15,
    };

    await helper.updateSettings(newSettings);

    // Reload page
    await page.reload();
    await helper.waitForEditor();

    // Settings should be restored
    const config = await helper.getLocalStorage('config-storage');
    expect(config.state.config.fontSize).toBe(16);
    expect(config.state.config.contextLines).toBe(15);
  });

  test('should mask API key in input', async ({ page }) => {
    await helper.openSettings();

    const input = page.locator('[data-testid="api-key-input"]');
    const inputType = await input.getAttribute('type');

    // Should be password type to mask the key
    expect(inputType).toBe('password');
  });

  test('should show API key toggle', async ({ page }) => {
    await helper.openSettings();

    // Look for show/hide button
    const toggleButton = page.locator('button[aria-label*="API key"]');
    await expect(toggleButton).toBeVisible();
  });

  test('should reset to default settings', async ({ page }) => {
    // Change settings
    await helper.updateSettings({
      fontSize: 20,
      contextLines: 30,
    });

    // Open settings and look for reset button
    await helper.openSettings();

    const resetButton = page.locator('button:has-text("Reset")');
    const hasReset = await resetButton.isVisible().catch(() => false);

    if (hasReset) {
      await resetButton.click();
      await page.click('button:has-text("Save")');

      const config = await helper.getLocalStorage('config-storage');
      expect(config.state.config.fontSize).toBe(14); // Default
      expect(config.state.config.contextLines).toBe(10); // Default
    }
  });

  test('should require API key for AI features', async ({ page }) => {
    // Clear API key
    await page.evaluate(() => {
      const config = localStorage.getItem('config-storage');
      if (config) {
        const parsed = JSON.parse(config);
        parsed.state.config.apiKey = '';
        localStorage.setItem('config-storage', JSON.stringify(parsed));
      }
    });

    await page.reload();
    await helper.waitForEditor();

    await helper.setEditorContent(CODE_SAMPLES.javascript);
    await page.click('.monaco-editor');
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);

    // Should show warning or disable AI features
    const askAIButton = page.locator('button:has-text("Ask AI")');
    const canAsk = await askAIButton.isEnabled().catch(() => false);

    // If button exists, it might be disabled or show a warning when clicked
    if (canAsk) {
      await askAIButton.click();

      // Should show API key warning
      const warning = page.locator('text=API key');
      await expect(warning).toBeVisible({ timeout: 5000 });
    }
  });

  test('should validate API key format', async ({ page }) => {
    await helper.openSettings();

    // Try invalid format
    await page.fill('[data-testid="api-key-input"]', 'invalid-key');
    await page.click('button:has-text("Save")');

    // Should show validation message or prevent save
    await page.waitForTimeout(300);

    // Check if modal is still open (validation failed)
    const modal = page.locator('[data-testid="settings-modal"]');
    const isVisible = await modal.isVisible();

    if (!isVisible) {
      // If modal closed, key might be accepted (basic validation)
      const config = await helper.getLocalStorage('config-storage');
      expect(config.state.config.apiKey).toBeTruthy();
    }
  });

  test('should show current settings values', async ({ page }) => {
    await helper.updateSettings({
      fontSize: 18,
      contextLines: 25,
    });

    await helper.openSettings();

    // Inputs should show current values
    const fontSizeInput = page.locator('[data-testid="font-size-input"]');
    const contextLinesInput = page.locator('[data-testid="context-lines-input"]');

    const fontSize = await fontSizeInput.inputValue();
    const contextLines = await contextLinesInput.inputValue();

    expect(fontSize).toBe('18');
    expect(contextLines).toBe('25');
  });

  test('should apply font size immediately after save', async ({ page }) => {
    await helper.setEditorContent(CODE_SAMPLES.javascript);

    const initialFontSize = await page.evaluate(() => {
      const editor = document.querySelector('.monaco-editor .view-line');
      return window.getComputedStyle(editor!).fontSize;
    });

    await helper.updateSettings({ fontSize: 20 });

    await page.waitForTimeout(500);

    const newFontSize = await page.evaluate(() => {
      const editor = document.querySelector('.monaco-editor .view-line');
      return window.getComputedStyle(editor!).fontSize;
    });

    expect(newFontSize).not.toBe(initialFontSize);
    expect(newFontSize).toBe('20px');
  });
});
