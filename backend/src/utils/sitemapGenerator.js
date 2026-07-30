const fs = require('fs');
const path = require('path');
const Blog = require('../models/Blog');

const updateBlogSitemap = async () => {
  try {
    const blogs = await Blog.find({ status: 'Published' }).sort({ createdAt: -1 });

    const staticBlogs = [
      'why-your-business-needs-a-professional-digital-marketing-company',
      'how-to-choose-the-best-web-design-company',
      'unlocking-organic-growth-local-seo-services',
      'guide-to-ppc-management-services',
      'social-media-marketing-services-brand-building'
    ];

    let urls = `  <url>\n    <loc>https://rizeworld.in/blogs</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;

    const addedSlugs = new Set();

    // 1. Add all published backend blogs
    for (const b of blogs) {
      if (!b.slug || addedSlugs.has(b.slug)) continue;
      addedSlugs.add(b.slug);
      const modDate = b.updatedAt ? new Date(b.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      urls += `  <url>\n    <loc>https://rizeworld.in/blogs/${b.slug}</loc>\n    <lastmod>${modDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    // 2. Add fallback static blogs
    for (const slug of staticBlogs) {
      if (addedSlugs.has(slug)) continue;
      addedSlugs.add(slug);
      urls += `  <url>\n    <loc>https://rizeworld.in/blogs/${slug}</loc>\n    <lastmod>2026-06-20</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}</urlset>\n`;

    const targetPaths = [
      path.resolve(__dirname, '../../../rize digital/public/sitemap-blogs.xml'),
      path.resolve(__dirname, '../../../rize digital/dist/sitemap-blogs.xml'),
      path.resolve(__dirname, '../../public/sitemap-blogs.xml')
    ];

    for (const targetPath of targetPaths) {
      try {
        const dir = path.dirname(targetPath);
        if (fs.existsSync(dir)) {
          fs.writeFileSync(targetPath, xmlContent, 'utf8');
        }
      } catch (e) {
        console.error(`Could not write sitemap to ${targetPath}:`, e.message);
      }
    }

    return xmlContent;
  } catch (error) {
    console.error('Error updating blog sitemap:', error);
    return null;
  }
};

module.exports = { updateBlogSitemap };
