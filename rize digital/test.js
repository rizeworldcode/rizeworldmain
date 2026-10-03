import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  await page.setViewport({ width: 1440, height: 900 });

  console.log('1. Loading Home page...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  console.log('Current URL:', page.url());

  console.log('2. Clicking Contact link in navbar...');
  await page.click('a[href="/contact"]');
  await new Promise(r => setTimeout(r, 600));
  console.log('Current URL after link click:', page.url());

  console.log('3. Reloading page while on Contact...');
  await page.reload({ waitUntil: 'networkidle0' });
  console.log('Current URL after reload:', page.url());

  const scrollY = await page.evaluate(() => window.scrollY);
  console.log('Scroll Y position after reload:', scrollY);

  await browser.close();
  console.log('Done!');
})();

