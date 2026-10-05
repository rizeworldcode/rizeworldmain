import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const isFirstRender = useRef(true);

  // Allow browser to natively restore scroll position on reload:
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto';
    }
  }, []);

  // Handle route changes and hash navigation:
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.replace('#', ''));
      let attempts = 0;
      const scrollToElement = () => {
        const element = document.getElementById(id) || document.getElementById(`project-${id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'instant', block: 'center' });
        } else if (attempts < 20) {
          attempts++;
          setTimeout(scrollToElement, 25);
        }
      };
      scrollToElement();
      isFirstRender.current = false;
      return;
    }

    // On initial page load or reload, preserve current scroll position and section
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // On normal page-to-page link navigation, scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}
