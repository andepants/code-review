import { test, expect } from '@playwright/test';
import { TestHelper } from './fixtures/helpers';
import { CODE_SAMPLES } from './fixtures/codeSamples';

test.describe('Responsive Design', () => {
  let helper: TestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new TestHelper(page);
    await helper.setupApp();
  });

  test.afterEach(async ({ page }) => {
    await helper.clearState();
  });

  test('should maintain 60/40 layout on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await helper.waitForEditor();

    const layout = await page.evaluate(() => {
      const editor = document.querySelector('[data-testid="editor-panel"]') as HTMLElement;
      const threads = document.querySelector('[data-testid="thread-panel"]') as HTMLElement;

      return {
        editorWidth: editor?.offsetWidth || 0,
        threadsWidth: threads?.offsetWidth || 0,
        totalWidth: window.innerWidth,
      };
    });

    const editorPercent = (layout.editorWidth / layout.totalWidth) * 100;
    const threadsPercent = (layout.threadsWidth / layout.totalWidth) * 100;

    // Should be approximately 60/40 split (allow some tolerance)
    expect(editorPercent).toBeGreaterThan(55);
    expect(editorPercent).toBeLessThan(65);
    expect(threadsPercent).toBeGreaterThan(35);
    expect(threadsPercent).toBeLessThan(45);
  });

  test('should adapt to smaller desktop screens', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await helper.waitForEditor();

    const editorVisible = await page.locator('[data-testid="editor-panel"]').isVisible();
    const threadsVisible = await page.locator('[data-testid="thread-panel"]').isVisible();

    expect(editorVisible).toBe(true);
    expect(threadsVisible).toBe(true);
  });

  test('should handle mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await helper.waitForEditor();

    // Both panels should exist (may stack or collapse)
    const editorExists = await page.locator('[data-testid="editor-panel"]').isVisible();
    const threadsExists = await page.locator('[data-testid="thread-panel"]').count();

    expect(editorExists).toBe(true);
    expect(threadsExists).toBeGreaterThan(0);
  });

  test('should handle tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await helper.waitForEditor();

    const editorVisible = await page.locator('[data-testid="editor-panel"]').isVisible();
    const threadsVisible = await page.locator('[data-testid="thread-panel"]').isVisible();

    expect(editorVisible).toBe(true);
    expect(threadsVisible).toBe(true);
  });

  test('should handle ultrawide displays', async ({ page }) => {
    await page.setViewportSize({ width: 3440, height: 1440 }); // Ultrawide
    await helper.waitForEditor();

    // Layout should still work
    const editorVisible = await page.locator('[data-testid="editor-panel"]').isVisible();
    const threadsVisible = await page.locator('[data-testid="thread-panel"]').isVisible();

    expect(editorVisible).toBe(true);
    expect(threadsVisible).toBe(true);
  });

  test('should maintain functionality on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await helper.setEditorContent(CODE_SAMPLES.javascript);

    // Editor should work
    const content = await helper.getEditorContent();
    expect(content).toContain('calculateTotal');

    // Should be able to interact
    await page.click('.monaco-editor');
    const editorFocused = await page.evaluate(() => {
      return document.activeElement?.classList.contains('monaco-editor') ||
             document.activeElement?.closest('.monaco-editor') !== null;
    });

    expect(editorFocused).toBe(true);
  });

  test('should scroll thread panel independently', async ({ page }) => {
    await helper.setEditorContent(CODE_SAMPLES.javascript);
    await page.setViewportSize({ width: 1920, height: 600 }); // Short viewport

    // Create multiple threads to trigger scroll
    for (let i = 0; i < 5; i++) {
      await page.click('.monaco-editor');
      await helper.selectLines(i + 1);
      await page.waitForTimeout(100);

      const askAI = page.locator('button:has-text("Ask AI")');
      const visible = await askAI.isVisible().catch(() => false);
      if (visible) {
        await askAI.click();
        await page.waitForTimeout(100);
      }
    }

    // Thread panel should be scrollable
    const threadPanel = page.locator('[data-testid="thread-panel"]');
    const isScrollable = await threadPanel.evaluate(el => {
      return el.scrollHeight > el.clientHeight;
    });

    // Should have scrollable content if many threads
    if ((await helper.getThreads()).length > 3) {
      expect(isScrollable).toBe(true);
    }
  });

  test('should maintain header visibility on all screen sizes', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },   // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1920, height: 1080 }, // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(300);

      const header = page.locator('[data-testid="app-header"]');
      const isVisible = await header.isVisible().catch(() => false);

      expect(isVisible).toBe(true);
    }
  });

  test('should adapt settings modal to screen size', async ({ page }) => {
    // Test on small screen
    await page.setViewportSize({ width: 375, height: 667 });
    await helper.openSettings();

    const modal = page.locator('[data-testid="settings-modal"]');
    await expect(modal).toBeVisible();

    const modalSize = await modal.boundingBox();
    expect(modalSize).toBeTruthy();
    expect(modalSize!.width).toBeLessThanOrEqual(375);

    await page.click('button:has-text("Cancel")');

    // Test on large screen
    await page.setViewportSize({ width: 1920, height: 1080 });
    await helper.openSettings();

    const modalLarge = await modal.boundingBox();
    expect(modalLarge).toBeTruthy();
    // Modal should be centered and reasonable size
    expect(modalLarge!.width).toBeLessThan(800);
  });

  test('should handle orientation changes', async ({ page }) => {
    // Portrait
    await page.setViewportSize({ width: 768, height: 1024 });
    await helper.waitForEditor();

    let editorVisible = await page.locator('[data-testid="editor-panel"]').isVisible();
    expect(editorVisible).toBe(true);

    // Landscape
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(300);

    editorVisible = await page.locator('[data-testid="editor-panel"]').isVisible();
    expect(editorVisible).toBe(true);
  });

  test('should maintain readable text on all screen sizes', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 1920, height: 1080 },
    ];

    await helper.setEditorContent(CODE_SAMPLES.javascript);

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(300);

      // Check font size is reasonable
      const fontSize = await page.evaluate(() => {
        const line = document.querySelector('.monaco-editor .view-line');
        return line ? parseInt(window.getComputedStyle(line).fontSize) : 0;
      });

      expect(fontSize).toBeGreaterThanOrEqual(10);
      expect(fontSize).toBeLessThanOrEqual(30);
    }
  });

  test('should handle very tall viewports', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 3000 });
    await helper.waitForEditor();

    const editorVisible = await page.locator('[data-testid="editor-panel"]').isVisible();
    expect(editorVisible).toBe(true);

    // Content should not be stretched awkwardly
    const layout = await page.evaluate(() => {
      const editor = document.querySelector('[data-testid="editor-panel"]') as HTMLElement;
      return {
        height: editor?.offsetHeight || 0,
        windowHeight: window.innerHeight,
      };
    });

    expect(layout.height).toBeGreaterThan(500);
  });

  test('should handle minimum viewport size', async ({ page }) => {
    // Very small viewport
    await page.setViewportSize({ width: 320, height: 568 }); // iPhone 5
    await helper.waitForEditor();

    // Should still be usable
    const editorExists = await page.locator('.monaco-editor').isVisible();
    expect(editorExists).toBe(true);

    // Should be able to type
    await helper.setEditorContent('test');
    const content = await helper.getEditorContent();
    expect(content).toBe('test');
  });
});
