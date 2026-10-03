import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });

  // wait 2 seconds for modal to appear (timer is 1.5s)
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'shot-modal-open.png' });
  console.log('Took shot-modal-open.png');

  // wait another 7.5 seconds for modal to auto-close (auto close timer is 7s)
  await new Promise(r => setTimeout(r, 7500));
  await page.screenshot({ path: 'shot-modal-closed.png' });
  console.log('Took shot-modal-closed.png');

  await browser.close();
  console.log('Done!');
})();
