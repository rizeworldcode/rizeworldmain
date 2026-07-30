import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  schema?: Record<string, any> | Record<string, any>[];
  noIndex?: boolean;
}

export default function SEO({ title, description, canonicalUrl, ogType = 'website', ogImage, schema, noIndex }: SEOProps) {
  useEffect(() => {
    // 1. Title
    document.title = title;

    // 2. Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Canonical Link
    let currentUrl = canonicalUrl;
    if (!currentUrl) {
      let path = window.location.pathname;
      if (!path.startsWith('/')) {
        path = '/' + path;
      }
      currentUrl = `https://rizeworld.in${path}`;
    } else {
      currentUrl = currentUrl.split('?')[0].split('#')[0];
      currentUrl = currentUrl.replace(/^(https?:\/\/)?(www\.)?/, 'https://');
    }
    if (currentUrl.endsWith('/') && currentUrl !== 'https://rizeworld.in/') {
      currentUrl = currentUrl.slice(0, -1);
    }

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', currentUrl);

    // 4. Open Graph Meta Tags
    const imageToUse = ogImage || 'https://rizeworld.in/images/logo/RW.png';
    const finalOgImage = imageToUse.startsWith('/') ? `https://rizeworld.in${imageToUse}` : imageToUse;

    const ogTags = {
      'og:title': title,
      'og:description': description,
      'og:url': currentUrl,
      'og:type': ogType,
      'og:image': finalOgImage,
      'og:site_name': 'RizeWorld Digital',
    };
    Object.entries(ogTags).forEach(([key, value]) => {
      let tag = document.querySelector(`meta[property="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', value);
    });

    // 5. Twitter Meta Tags
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': finalOgImage,
    };
    Object.entries(twitterTags).forEach(([key, value]) => {
      let tag = document.querySelector(`meta[name="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', value);
    });

    // 6. Robots Meta Tag
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    const noIndexPaths = ['/login', '/dashboard', '/admin', '/account', '/internal'];
    const isNoIndex = noIndex || noIndexPaths.some(path => window.location.pathname.startsWith(path));
    metaRobots.setAttribute('content', isNoIndex ? 'noindex,follow' : 'index,follow');

    // 7. JSON-LD Schema
    const oldScripts = document.querySelectorAll('script[type="application/ld+json"].seo-schema');
    oldScripts.forEach(s => s.remove());

    if (schema) {
      const schemas = Array.isArray(schema) ? schema : [schema];
      schemas.forEach((sObj) => {
        const script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.className = 'seo-schema';
        script.text = JSON.stringify(sObj);
        document.head.appendChild(script);
      });
    }

  }, [title, description, canonicalUrl, ogType, ogImage, schema, noIndex]);

  return null;
}
