const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  try {
    // Try Figma embed
    await page.goto('https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/i1k7Fza2KTfZF4xyO76ofK/Untitled?node-id=0-1', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(8000);
    await page.screenshot({ path: 'figma_embed.png', fullPage: true });
    console.log('Embed screenshot saved: figma_embed.png');
  } catch (e) {
    console.log('Error:', e.message);
    await page.screenshot({ path: 'figma_embed.png' });
  }

  await browser.close();
})();
