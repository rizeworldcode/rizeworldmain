import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  // On page mount / reload:
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const isPrerender = typeof navigator !== 'undefined' && (
      navigator.webdriver ||
      navigator.userAgent.includes('Headless') ||
      navigator.userAgent.includes('Puppeteer') ||
      /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent)
    );

    if (!isPrerender) {
      const navEntries = performance.getEntriesByType('navigation');
      const navType = (navEntries[0] as PerformanceNavigationTiming)?.type;
      const isReload = navType === 'reload' || (performance as any)?.navigation?.type === 1;

      if (isReload) {
        if (pathname !== '/') {
          navigate('/', { replace: true });
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }
  }, []);

  // On route change (clicking links), scroll to top or hash target
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}
