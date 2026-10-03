import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:5173...');
  
  // Navigate
  await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: 'shot-0ms.png' });
  console.log('Took shot-0ms');

  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'shot-500ms.png' });
  console.log('Took shot-500ms');

  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'shot-2000ms.png' });
  console.log('Took shot-2000ms (modal should be visible)');

  await new Promise(r => setTimeout(r, 6000));
  await page.screenshot({ path: 'shot-8000ms.png' });
  console.log('Took shot-8000ms (modal should auto close)');

  await browser.close();
  console.log('Done!');
})();
