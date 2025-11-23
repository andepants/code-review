import { test, expect } from '@playwright/test';
import { TestHelper } from './fixtures/helpers';

test.describe('Smoke Tests - Quick Validation', () => {
  let helper: TestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new TestHelper(page);
  });

  test('application loads successfully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that main elements are present
    const root = await page.locator('#root').isVisible();
    expect(root).toBe(true);
  });

  test('editor initializes', async ({ page }) => {
    await helper.setupApp();
    await helper.waitForEditor();

    const editorExists = await page.locator('.monaco-editor').isVisible();
    expect(editorExists).toBe(true);
  });

  test('thread panel is visible', async ({ page }) => {
    await helper.setupApp();

    const threadPanel = await page.locator('[data-testid="thread-panel"]').isVisible();
    expect(threadPanel).toBe(true);
  });

  test('settings modal opens', async ({ page }) => {
    await helper.setupApp();
    await helper.openSettings();

    const modal = page.locator('[data-testid="settings-modal"]');
    await expect(modal).toBeVisible();
  });
});
