import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: string;
  schema?: Record<string, any> | Record<string, any>[];
}

export default function SEO({ title, description, canonicalUrl, ogType = 'website', schema }: SEOProps) {
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
    const currentUrl = canonicalUrl || window.location.href;
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', currentUrl);

    // 4. Open Graph Meta Tags
    const ogTags = {
      'og:title': title,
      'og:description': description,
      'og:url': currentUrl,
      'og:type': ogType,
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

    // 6. JSON-LD Schema
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

  }, [title, description, canonicalUrl, ogType, schema]);

  return null;
}
