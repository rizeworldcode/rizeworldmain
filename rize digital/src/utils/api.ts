export const getBackendHost = (): string => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:45000';
  }
  return 'https://rizeworldmain.onrender.com';
};

export const getApiBaseUrl = (): string => {
  return `${getBackendHost()}/api`;
};

export const getImageUrl = (imagePath?: string, fallback: string = '/images/blogs/blog_prototyping_design.png'): string => {
  if (!imagePath || imagePath.trim() === '') return fallback;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  const host = getBackendHost();
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${host}${normalizedPath}`;
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'RECENT';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString.toUpperCase();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;
  } catch {
    return dateString.toUpperCase();
  }
};

export const categoryToSlug = (categoryName?: string): string => {
  if (!categoryName) return 'general';
  const cat = categoryName.toLowerCase().trim();
  if (cat.includes('marketing') || cat.includes('digital')) return 'digital-marketing';
  if (cat.includes('seo')) return 'seo';
  if (cat.includes('social') || cat.includes('media') || cat.includes('smm')) return 'social-media-marketing';
  if (cat.includes('paid') || cat.includes('ad') || cat.includes('ppc')) return 'paid-ads';
  if (cat.includes('web') || cat.includes('dev')) return 'web-development';
  if (cat.includes('content')) return 'content-marketing';
  if (cat.includes('commerce') || cat.includes('shop')) return 'ecommerce';
  if (cat.includes('ui') || cat.includes('ux') || cat.includes('design')) return 'ui-ux';
  return cat.replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
};
