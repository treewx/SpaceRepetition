const { test, expect } = require('@playwright/test');

test.describe('Character Image Generation Bug', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('file://' + __dirname.replace('\\tests', '') + '/index.html');
    
    // Wait for the app to initialize
    await page.waitForLoadState('networkidle');
    
    // Switch to Dictionary tab
    await page.click('#dictionary-tab');
    await page.waitForTimeout(500);
  });

  test('should reproduce the character image generation bug', async ({ page }) => {
    // Mock API response for search
    await page.route('**/api/translate*', async route => {
      await route.fulfill({
        json: {
          translation: "good",
          characters: [
            {
              character: "好",
              pinyin: "hǎo",
              meaning: "good, well"
            }
          ]
        }
      });
    });

    // Search for a character
    await page.fill('#dictionary-search', '好');
    await page.click('#dictionary-search-btn');
    
    // Wait for results
    await page.waitForTimeout(1000);
    
    // Click "Add to Dictionary" button for the character
    const addButton = page.locator('.add-character-btn').first();
    await addButton.waitFor({ state: 'visible' });
    await addButton.click();
    
    // Wait for the character mnemonic modal to open
    const modal = page.locator('#character-modal');
    await modal.waitFor({ state: 'visible' });
    
    // Verify the modal title contains the character
    const modalTitle = page.locator('#character-modal-title');
    await expect(modalTitle).toContainText('好');
    
    // Click "Generate Mnemonic Image" button
    const generateImageBtn = page.locator('#generate-character-image-btn');
    await expect(generateImageBtn).toBeVisible();
    await generateImageBtn.click();
    
    // Wait for the alert dialog
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('Character image generation coming soon!');
      await dialog.accept();
    });
    
    // Verify the bug: the alert should appear with "coming soon" message
    await page.waitForTimeout(1000);
  });

  test('should have proper UI elements for character image generation', async ({ page }) => {
    // Mock API response
    await page.route('**/api/translate*', async route => {
      await route.fulfill({
        json: {
          translation: "good", 
          characters: [
            {
              character: "好",
              pinyin: "hǎo", 
              meaning: "good, well"
            }
          ]
        }
      });
    });

    // Search and add character
    await page.fill('#dictionary-search', '好');
    await page.click('#dictionary-search-btn');
    await page.waitForTimeout(1000);
    
    const addButton = page.locator('.add-character-btn').first();
    await addButton.click();
    
    // Verify UI elements exist
    const modal = page.locator('#character-modal');
    await modal.waitFor({ state: 'visible' });
    
    await expect(page.locator('#character-gemini-api-key')).toBeVisible();
    await expect(page.locator('#character-image-prompt')).toBeVisible();
    await expect(page.locator('#generate-character-image-btn')).toBeVisible();
    await expect(page.locator('#character-image-preview')).toBeVisible();
  });
});