import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import XLSX from 'xlsx'

// Extract Excel Data
try {
  const filePath = path.join(__dirname, 'public', 'Stuffing Free Rize World (2).xlsx');
  if (fs.existsSync(filePath)) {
    const workbook = XLSX.readFile(filePath, { cellStyles: true });
    const result: any = {};
    
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
      
      const columnsData: any = {};
      
      for (let c = range.s.c; c <= range.e.c; c++) {
        // Find column header: first cell in this column that has a value (usually row 0)
        let header = '';
        let headerRowIdx = 0;
        for (let r = range.s.r; r <= Math.min(range.e.r, 5); r++) {
          const cellRef = XLSX.utils.encode_cell({ r, c });
          const cell = sheet[cellRef];
          if (cell && cell.v !== undefined && cell.v !== null) {
            const text = String(cell.v).trim();
            if (text) {
              header = text;
              headerRowIdx = r;
              break;
            }
          }
        }
        
        if (!header) continue;
        
        // Skip metric column headers like "S/Comp."
        if (header.toLowerCase().includes('comp.') || header.includes('/Comp')) continue;
        
        const primarySet = new Set<string>();
        const secondarySet = new Set<string>();
        const lsiSet = new Set<string>();
        
        // Check if the header cell itself is a keyword (has black/no color vs white)
        const headerCellRef = XLSX.utils.encode_cell({ r: headerRowIdx, c });
        const headerCell = sheet[headerCellRef];
        const headerRgb = headerCell?.s?.fgColor?.rgb || headerCell?.s?.bgColor?.rgb;
        if (!headerRgb || headerRgb.toUpperCase() === '000000') {
          primarySet.add(header);
        }
        
        for (let r = headerRowIdx + 1; r <= range.e.r; r++) {
          const cellRef = XLSX.utils.encode_cell({ r, c });
          const cell = sheet[cellRef];
          if (cell && cell.v !== undefined && cell.v !== null) {
            const text = String(cell.v).trim();
            if (!text) continue;
            
            // Skip metric rows (e.g., "1K–10K / Low", "10–100 / Low / 23–160")
            if (
              text.toLowerCase().includes('comp.') ||
              /^\d+/.test(text) || // starts with number
              /\d+\s*-\s*\d+/.test(text) || // range
              /\d+\s*–\s*\d+/.test(text) || // range with dash
              (text.includes('/') && /\d/.test(text)) // slash and a digit
            ) {
              continue;
            }
            
            const rgb = cell.s?.fgColor?.rgb || cell.s?.bgColor?.rgb;
            if (rgb) {
              const upperRgb = rgb.toUpperCase();
              if (upperRgb === '000000') {
                primarySet.add(text);
              } else if (upperRgb === '00FF00') {
                secondarySet.add(text);
              } else if (upperRgb === 'FF0000') {
                lsiSet.add(text);
              }
            }
          }
        }
        
        if (primarySet.size > 0 || secondarySet.size > 0 || lsiSet.size > 0) {
          columnsData[header] = {
            primary: Array.from(primarySet),
            secondary: Array.from(secondarySet),
            lsi: Array.from(lsiSet)
          };
        }
      }
      
      if (Object.keys(columnsData).length > 0) {
        result[sheetName] = columnsData;
      }
    });
    const outputPath = path.join(__dirname, 'src', 'data', 'cleaned_keywords.json');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log('Successfully wrote structured keywords to cleaned_keywords.json');
  } else {
    console.log('Excel file not found at:', filePath);
  }
} catch (error: any) {
  console.error('Error parsing Excel in vite.config.ts:', error.message);
}

const ROUTE_FALLBACKS: Record<string, { title: string; description: string }> = {
  '/about': {
    title: 'About Our Digital Marketing Agency | RizeWorld',
    description: 'Learn more about RizeWorld, a leading digital solutions company. Discover how our online marketing services and professional web design agency scale brands.'
  },
  '/services': {
    title: 'Digital Marketing Services & Solutions Company | RizeWorld',
    description: 'Explore high-impact digital marketing services, custom web design, SEO, PPC management, and social media marketing to grow your business online with RizeWorld.'
  },
  '/services/digital-marketing': {
    title: 'Premium Digital Marketing Service & Agency | RizeWorld',
    description: 'Accelerate business growth with comprehensive digital marketing services from RizeWorld. Targeted online campaigns, lead generation, and performance marketing.'
  },
  '/services/web-development': {
    title: 'Web Design Services & Website Design Company | RizeWorld',
    description: 'Custom, fast, and responsive web design services. Build high-converting corporate websites and web applications with RizeWorld expert developers.'
  },
  '/services/seo': {
    title: 'SEO Services India & Search Engine Optimization | RizeWorld',
    description: 'Boost organic search rankings and traffic with expert SEO services. Technical SEO, on-page optimization, quality link building, and keyword strategies.'
  },
  '/services/social-media-marketing': {
    title: 'Social Media Marketing Services & SMM Agency | RizeWorld',
    description: 'Grow your social presence, engage followers, and run targeted campaigns across Instagram, LinkedIn, and Facebook with RizeWorld social media marketing.'
  },
  '/services/paid-ads': {
    title: 'PPC Management Services & Google Ads Agency | RizeWorld',
    description: 'Maximize ROI with high-converting Google Ads and paid advertising campaigns managed by certified PPC experts at RizeWorld.'
  },
  '/services/wordpress-development': {
    title: 'WordPress Development Services & Custom Company | RizeWorld',
    description: 'Scalable, secure, and custom WordPress website development services tailored for businesses, eCommerce, and enterprise portals.'
  },
  '/services/custom-website-development': {
    title: 'Custom Website Development Services | RizeWorld',
    description: 'Tailored full-stack website and web application development built with modern technologies for speed, security, and scalability.'
  },
  '/services/content-marketing': {
    title: 'Content Marketing Services & Content Writing Agency | RizeWorld',
    description: 'Drive engagement and organic conversions with authoritative, SEO-optimized content marketing and copywriting services.'
  },
  '/services/graphic-design': {
    title: 'Graphic Design Services & Branding Agency | RizeWorld',
    description: 'Transform your brand identity with creative graphic design, logo design, visual branding, and marketing collateral.'
  },
  '/services/ecommerce-development': {
    title: 'Ecommerce Development Services & Online Store Agency | RizeWorld',
    description: 'Build fast, user-friendly, and secure eCommerce stores with custom checkout workflows and conversion rate optimization.'
  },
  '/services/ui-ux-design': {
    title: 'UI/UX Design Services | RizeWorld',
    description: 'Deliver intuitive, engaging, and beautiful user experiences with human-centric UI/UX design and wireframing services.'
  },
  '/team': {
    title: 'Our Team | Digital Marketing Experts & Web Developers | RizeWorld',
    description: 'Meet the passionate team of digital marketers, developers, SEO specialists, and designers behind RizeWorld Digital.'
  },
  '/portfolio': {
    title: 'Our Digital Marketing & Web Design Portfolio | RizeWorld',
    description: 'Explore client success stories, creative branding, and web design projects successfully delivered by RizeWorld Digital.'
  },
  '/careers': {
    title: 'Careers | Join Our Digital Marketing Agency | RizeWorld',
    description: 'Explore rewarding career opportunities at RizeWorld. Join our dynamic team of marketing strategists, developers, and designers.'
  },
  '/contact': {
    title: 'Contact Our Digital Marketing Agency | RizeWorld',
    description: 'Get in touch with RizeWorld Digital, a premier digital solutions company. Contact us to discuss your online marketing services or web development project requirements.'
  },
  '/blogs': {
    title: 'Digital Marketing Insights & Strategy Blog | RizeWorld',
    description: 'Stay ahead of digital trends with actionable guides, SEO tips, advertising strategies, and web design best practices on RizeWorld blog.'
  },
  '/case-studies': {
    title: 'Case Studies & Results | Digital Marketing Agency | RizeWorld',
    description: 'Real client case studies demonstrating measurable ROI, traffic surges, and conversion rate growth powered by RizeWorld.'
  },
  '/faq': {
    title: 'FAQ | Digital Marketing & SEO Services Questions | RizeWorld',
    description: 'Find answers to frequently asked questions about RizeWorld digital marketing, SEO, web development pricing, timelines, and deliverables.'
  },
  '/pricing': {
    title: 'SEO, Social Media & Web Development Pricing Packages | RizeWorld',
    description: 'Transparent and affordable pricing packages for SEO, social media marketing, PPC campaigns, and web development services at RizeWorld.'
  },
  '/privacy': {
    title: 'Privacy Policy | RizeWorld',
    description: 'Read the privacy policy of RizeWorld to understand how we collect, protect, and use your personal data.'
  },
  '/terms': {
    title: 'Terms of Service | RizeWorld',
    description: 'Read the terms of service governing your use of RizeWorld digital solutions, agency services, and website.'
  },
  '/accessibility': {
    title: 'Accessibility Arrangements | RizeWorld',
    description: 'Learn about RizeWorld accessibility features and commitment to making digital experiences accessible to everyone.'
  },
  '/locations': {
    title: 'Our Serviced Cities & Regional Office Mappings | RizeWorld',
    description: 'Discover all the cities and regional locations across India serviced by RizeWorld Digital Marketing Agency.'
  }
};

function devPrerenderPlugin() {
  return {
    name: 'dev-prerender',
    apply: 'serve' as const,
    transformIndexHtml(html: string, ctx: any) {
      try {
        const rawUrl = ctx.originalUrl || ctx.path || '/';
        const urlPath = rawUrl.split('?')[0].replace(/\/+$/, '') || '/';
        
        if (urlPath === '/' || urlPath === '') {
          return html;
        }

        const host = (ctx.req && ctx.req.headers && ctx.req.headers.host) || 'localhost:5173';
        const protocol = (ctx.req && ctx.req.headers && ctx.req.headers['x-forwarded-proto']) || 'http';
        const currentUrl = `${protocol}://${host}${urlPath}`;
        
        const targetFile = path.join(__dirname, 'dist', urlPath, 'index.html');
        if (fs.existsSync(targetFile)) {
          const distHtml = fs.readFileSync(targetFile, 'utf-8');
          
          // 1. Title
          const titleMatch = distHtml.match(/<title>([\s\S]*?)<\/title>/i);
          if (titleMatch) {
            const pageTitle = titleMatch[1].trim();
            html = html.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);
          }
          
          // 2. Meta description (robust multiline match)
          const descMatch = distHtml.match(/<meta\s+[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i) ||
                            distHtml.match(/<meta\s+[^>]*content=["']([\s\S]*?)["'][^>]*name=["']description["'][^>]*>/i);
          if (descMatch) {
            const pageDesc = descMatch[1].trim();
            html = html.replace(/<meta\s+name=["']description["'].*?>/i, `<meta name="description" content="${pageDesc}" />`);
          }

          // 3. OpenGraph tags
          const ogProps = ['og:title', 'og:description', 'og:url', 'og:image'];
          for (const prop of ogProps) {
            const ogRegex = new RegExp(`<meta\\s+[^>]*property=["']${prop}["'][^>]*content=["']([\\s\\S]*?)["'][^>]*>`, 'i');
            const m = distHtml.match(ogRegex);
            if (m) {
              const val = prop === 'og:url' ? currentUrl : m[1].trim();
              const targetRegex = new RegExp(`<meta\\s+[^>]*property=["']${prop}["'][^>]*>`, 'i');
              if (targetRegex.test(html)) {
                html = html.replace(targetRegex, `<meta property="${prop}" content="${val}" />`);
              } else {
                html = html.replace('</head>', `  <meta property="${prop}" content="${val}" />\n</head>`);
              }
            }
          }

          // 4. Twitter tags
          const twProps = ['twitter:title', 'twitter:description', 'twitter:image'];
          for (const prop of twProps) {
            const twRegex = new RegExp(`<meta\\s+[^>]*name=["']${prop}["'][^>]*content=["']([\\s\\S]*?)["'][^>]*>`, 'i');
            const m = distHtml.match(twRegex);
            if (m) {
              const val = m[1].trim();
              const targetRegex = new RegExp(`<meta\\s+[^>]*name=["']${prop}["'][^>]*>`, 'i');
              if (targetRegex.test(html)) {
                html = html.replace(targetRegex, `<meta name="${prop}" content="${val}" />`);
              } else {
                html = html.replace('</head>', `  <meta name="${prop}" content="${val}" />\n</head>`);
              }
            }
          }

          // 5. Canonical link
          if (html.includes('rel="canonical"')) {
            html = html.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${currentUrl}" />`);
          } else {
            html = html.replace('</head>', `  <link rel="canonical" href="${currentUrl}" />\n</head>`);
          }

          // 6. Semantic root content
          const rootMatch = distHtml.match(/<div id="root">([\s\S]*?)<\/div>/i);
          if (rootMatch && rootMatch[1].trim()) {
            html = html.replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">\n${rootMatch[1].trim()}\n</div>`);
          }
        } else if (ROUTE_FALLBACKS[urlPath]) {
          // If dist has not been generated for this route yet, apply built-in route fallback
          const fb = ROUTE_FALLBACKS[urlPath];
          html = html.replace(/<title>.*?<\/title>/i, `<title>${fb.title}</title>`);
          html = html.replace(/<meta\s+name=["']description["'].*?>/i, `<meta name="description" content="${fb.description}" />`);
          html = html.replace(/<meta\s+property=["']og:title["'].*?>/i, `<meta property="og:title" content="${fb.title}" />`);
          html = html.replace(/<meta\s+property=["']og:description["'].*?>/i, `<meta property="og:description" content="${fb.description}" />`);
          html = html.replace(/<meta\s+property=["']og:url["'].*?>/i, `<meta property="og:url" content="${currentUrl}" />`);
          html = html.replace(/<meta\s+name=["']twitter:title["'].*?>/i, `<meta name="twitter:title" content="${fb.title}" />`);
          html = html.replace(/<meta\s+name=["']twitter:description["'].*?>/i, `<meta name="twitter:description" content="${fb.description}" />`);
          if (html.includes('rel="canonical"')) {
            html = html.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${currentUrl}" />`);
          } else {
            html = html.replace('</head>', `  <link rel="canonical" href="${currentUrl}" />\n</head>`);
          }
        }
      } catch (e) {
        // Fallback gracefully
      }
      return html;
    },
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const cleanUrl = (req.url || '').split('?')[0];

        // Handle sitemap-blogs.xml with live dynamic blogs
        if (cleanUrl === '/sitemap-blogs.xml') {
          try {
            let response = await fetch('http://localhost:45000/sitemap-blogs.xml').catch(() => null);
            if (!response || !response.ok) {
              response = await fetch('https://rizeworldmain.onrender.com/sitemap-blogs.xml').catch(() => null);
            }
            if (response && response.ok) {
              let xml = await response.text();
              const host = req.headers.host || 'localhost:5173';
              xml = xml.replaceAll('https://rizeworld.in', `http://${host}`);
              res.setHeader('Content-Type', 'application/xml; charset=utf-8');
              return res.end(xml);
            }
          } catch (e) {}
        }

        // Handle all sitemap XML files locally with local host URLs
        if (cleanUrl.startsWith('/sitemap') && cleanUrl.endsWith('.xml')) {
          const fileName = cleanUrl.replace(/^\//, '');
          const filePath = path.join(__dirname, 'public', fileName);
          if (fs.existsSync(filePath)) {
            let xml = fs.readFileSync(filePath, 'utf-8');
            const host = req.headers.host || 'localhost:5173';
            xml = xml.replaceAll('https://rizeworld.in', `http://${host}`);
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            return res.end(xml);
          }
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devPrerenderPlugin()],
  base: '/',
  server: {
    host: true
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        notfound: path.resolve(__dirname, '404.html')
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three';
            if (id.includes('tsparticles') || id.includes('react-tsparticles')) return 'tsparticles';
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('gsap')) return 'gsap';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'react-core';
            return 'vendor';
          }
        }
      }
    }
  }
})
