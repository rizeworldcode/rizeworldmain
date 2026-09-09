import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const url = req.url();
    if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
      req.abort();
    } else if (url.includes('/assets/') && !url.startsWith('http://localhost:4173/assets/')) {
      const newUrl = url.replace(/http:\/\/localhost:4173\/.*\/assets\//, 'http://localhost:4173/assets/');
      console.log('REWRITING:', url, '->', newUrl);
      req.continue({ url: newUrl });
    } else {
      req.continue();
    }
  });
  
  page.on('response', res => {
    console.log('RESPONSE:', res.url(), res.status());
  });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await page.goto('http://localhost:4173/locations/karnataka', { waitUntil: 'networkidle0' });
  
  const meta = await page.evaluate(() => {
    return {
      title: document.title,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      og: document.querySelector('meta[property="og:url"]')?.content
    }
  });
  console.log(meta);
  await browser.close();
})();
