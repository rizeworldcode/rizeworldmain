import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import xml2js from 'xml2js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');
const templatePath = path.join(distDir, 'index.html');
const publicDir = path.join(__dirname, 'public');

if (!fs.existsSync(templatePath)) {
  console.error('Error: dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(templatePath, 'utf-8');

// Function to find all sitemap files in the public directory and extract URLs
async function discoverRoutes() {
  const routes = new Set();
  const files = fs.readdirSync(publicDir);
  const sitemapFiles = files.filter(f => f.startsWith('sitemap') && f.endsWith('.xml'));

  const parser = new xml2js.Parser();

  for (const file of sitemapFiles) {
    const filePath = path.join(publicDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    try {
      const result = await parser.parseStringPromise(content);
      // For sitemap index or urlset
      if (result.urlset && result.urlset.url) {
        for (const urlObj of result.urlset.url) {
          if (urlObj.loc && urlObj.loc[0]) {
            let loc = urlObj.loc[0];
            // Normalize path
            if (loc.startsWith('http')) {
              try {
                const url = new URL(loc);
                routes.add(url.pathname);
              } catch (e) {
                console.error(`Invalid URL in ${file}: ${loc}`);
              }
            } else {
              routes.add(loc);
            }
          }
        }
      }
    } catch (err) {
      console.error(`Error parsing ${file}:`, err);
    }
  }

  // Ensure root is included
  routes.add('/');
  
  // Return sorted array
  return Array.from(routes).sort();
}

async function startPreviewServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting Vite preview server...');
    const server = spawn('npm', ['run', 'preview', '--', '--port', '4173', '--strictPort'], {
      cwd: __dirname,
      shell: true,
      stdio: 'pipe'
    });

    let stdoutData = '';
    server.stdout.on('data', (data) => {
      stdoutData += data.toString();
      if (stdoutData.includes('http://localhost:4173') || stdoutData.includes('4173')) {
        resolve(server);
      }
    });

    server.stderr.on('data', (data) => {
      console.error(`Preview Server Error: ${data}`);
    });

    server.on('error', (err) => {
      reject(err);
    });
    
    // Timeout in case server fails to start properly
    setTimeout(() => {
      reject(new Error(`Preview server start timeout. Output so far: ${stdoutData}`));
    }, 20000);
  });
}

async function runPrerender() {
  const routes = await discoverRoutes();
  console.log(`Discovered ${routes.length} routes from sitemaps.`);

  const server = await startPreviewServer();
  console.log('Preview server started on http://localhost:4173');

  let successCount = 0;
  const failedRoutes = [];

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    console.log('Generating SEO prerendered HTML files...');

    for (const route of routes) {
      const url = `http://localhost:4173${route}`;
      console.log(`Prerendering ${route}...`);
      
      const page = await browser.newPage();
      
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const reqUrl = req.url();
        if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
          req.abort();
        } else if (reqUrl.includes('/assets/') && !reqUrl.startsWith('http://localhost:4173/assets/')) {
          const newUrl = reqUrl.replace(/http:\/\/localhost:4173\/.*\/assets\//, 'http://localhost:4173/assets/');
          req.continue({ url: newUrl });
        } else if (reqUrl.includes(':45000') || reqUrl.includes('/api/')) {
          req.abort();
        } else {
          req.continue();
        }
      });

      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
        
        const isHomepage = route === '/';
        const expectedCanonical = isHomepage 
          ? 'https://rizeworld.in/' 
          : `https://rizeworld.in${route.endsWith('/') && route.length > 1 ? route.slice(0, -1) : route}`;

        // Wait for deterministic readiness condition
        await page.waitForFunction(
          (canonical, isHome) => {
            const title = document.title;
            const canLink = document.querySelector('link[rel="canonical"]');
            const ogTag = document.querySelector('meta[property="og:url"]');
            const descTag = document.querySelector('meta[name="description"]');
            
            if (!title || !canLink || !ogTag || !descTag) return false;
            
            const actualCanonical = canLink.href.replace(/https?:\/\/localhost:\d+/, 'https://rizeworld.in');
            const actualOg = ogTag.content.replace(/https?:\/\/localhost:\d+/, 'https://rizeworld.in');
            
            if (isHome) {
              return actualCanonical === canonical && actualOg === canonical;
            } else {
              const isGenericTitle = title === 'RizeWorld Digital' || 
                                     title === 'Full-Service Digital Marketing Agency & SEO Company | RizeWorld';
              const isGenericDesc = descTag.content === 'RizeWorld Digital Solutions' || 
                                    descTag.content.includes('Looking for the best digital marketing services');
              const is404 = title.includes('404');
              
              return actualCanonical === canonical && 
                     actualOg === canonical && 
                     !isGenericTitle && 
                     !isGenericDesc &&
                     !is404;
            }
          },
          { timeout: 10000 },
          expectedCanonical,
          isHomepage
        );

        // Extract metadata
        const metadata = await page.evaluate(() => {
          const getMeta = (selector) => {
            const el = document.querySelector(selector);
            return el ? el.getAttribute('content') : null;
          };
          
          const getLink = (selector) => {
            const el = document.querySelector(selector);
            return el ? el.getAttribute('href') : null;
          };

          return {
            title: document.title,
            description: getMeta('meta[name="description"]'),
            canonical: getLink('link[rel="canonical"]'),
            canonicalCount: document.querySelectorAll('link[rel="canonical"]').length,
            ogTitle: getMeta('meta[property="og:title"]'),
            ogDesc: getMeta('meta[property="og:description"]'),
            ogUrl: getMeta('meta[property="og:url"]'),
            ogImage: getMeta('meta[property="og:image"]'),
            twTitle: getMeta('meta[name="twitter:title"]'),
            twDesc: getMeta('meta[name="twitter:description"]'),
            twImage: getMeta('meta[name="twitter:image"]')
          };
        });

        await page.close();

        if (metadata.canonical) {
          metadata.canonical = metadata.canonical.replace(/https?:\/\/localhost:\d+/, 'https://rizeworld.in');
        }
        if (metadata.ogUrl) {
          metadata.ogUrl = metadata.ogUrl.replace(/https?:\/\/localhost:\d+/, 'https://rizeworld.in');
        }

        // Validate metadata BEFORE writing HTML
        if (!metadata.title) throw new Error("Missing title");
        if (!metadata.description) throw new Error("Missing description");
        if (!metadata.canonical) throw new Error("Missing canonical URL");
        if (!metadata.ogUrl) throw new Error("Missing og:url");
        if (metadata.canonicalCount !== 1) throw new Error(`Expected exactly 1 canonical tag, found ${metadata.canonicalCount}`);
        
        if (metadata.canonical !== expectedCanonical) throw new Error(`Canonical mismatch. Expected ${expectedCanonical}, got ${metadata.canonical}`);
        if (metadata.ogUrl !== metadata.canonical) throw new Error(`og:url mismatch. Expected ${metadata.canonical}, got ${metadata.ogUrl}`);
        
        if (!isHomepage) {
          if (metadata.title === 'RizeWorld Digital' || metadata.title === 'Full-Service Digital Marketing Agency & SEO Company | RizeWorld') {
            throw new Error("Inner page has generic homepage title");
          }
          if (metadata.title.includes('404')) {
            throw new Error("Page rendered as 404 Not Found (e.g. data missing)");
          }
          if (metadata.description === 'RizeWorld Digital Solutions' || metadata.description.includes('Looking for the best digital marketing services')) {
            throw new Error("Inner page has generic homepage description");
          }
        }

        let html = templateHtml;
        
        if (metadata.title) {
          html = html.replace(/<title>.*?<\/title>/, `<title>${metadata.title}</title>`);
        }
        
        if (metadata.description) {
          html = html.replace(/<meta name="description".*?>/, `<meta name="description" content="${metadata.description}" />`);
        }

        const ogTagsMap = {
          'og:title': metadata.ogTitle,
          'og:description': metadata.ogDesc,
          'og:url': metadata.ogUrl,
          'og:image': metadata.ogImage,
        };
        for (const [prop, val] of Object.entries(ogTagsMap)) {
          if (val) {
            const regex = new RegExp(`<meta property="${prop}".*?>`);
            if (regex.test(html)) {
              html = html.replace(regex, `<meta property="${prop}" content="${val}" />`);
            } else {
              html = html.replace('</head>', `  <meta property="${prop}" content="${val}" />\n</head>`);
            }
          }
        }

        const twTagsMap = {
          'twitter:title': metadata.twTitle,
          'twitter:description': metadata.twDesc,
          'twitter:image': metadata.twImage,
        };
        for (const [prop, val] of Object.entries(twTagsMap)) {
          if (val) {
            const regex = new RegExp(`<meta name="${prop}".*?>`);
            if (regex.test(html)) {
              html = html.replace(regex, `<meta name="${prop}" content="${val}" />`);
            } else {
              html = html.replace('</head>', `  <meta name="${prop}" content="${val}" />\n</head>`);
            }
          }
        }

        if (metadata.canonical) {
          const canonicalRegex = /<link rel="canonical".*?>/;
          if (canonicalRegex.test(html)) {
            html = html.replace(canonicalRegex, `<link rel="canonical" href="${metadata.canonical}" />`);
          } else {
            html = html.replace('</head>', `  <link rel="canonical" href="${metadata.canonical}" />\n</head>`);
          }
        }

        let outputPath = templatePath;
        if (route !== '/') {
          const dir = path.join(distDir, route);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          outputPath = path.join(dir, 'index.html');
        }

        fs.writeFileSync(outputPath, html, 'utf-8');
        successCount++;
      } catch (e) {
        console.error(`Error prerendering ${route}:`, e.message);
        failedRoutes.push({ route, error: e.message });
      }
    }

    await browser.close();
  } catch (err) {
    console.error('Fatal error during prerendering:', err);
    process.exitCode = 1;
  } finally {
    server.kill();
    
    console.log('\n==================================================');
    console.log('PRERENDER REPORT');
    console.log('==================================================');
    console.log(`TOTAL ROUTES: ${routes.length}`);
    console.log(`SUCCESSFUL: ${successCount}`);
    console.log(`FAILED: ${failedRoutes.length}`);

    if (failedRoutes.length > 0) {
      console.error('\nFAILED ROUTES:');
      failedRoutes.forEach(f => {
        console.error(`- ${f.route}`);
        console.error(`  Reason: ${f.error}`);
      });
      console.error('\nSEO prerendering failed. Build will be aborted.');
      process.exit(1);
    } else {
      console.log('\nSEO prerendering completed successfully.');
      process.exit(0);
    }
  }
}

runPrerender();
