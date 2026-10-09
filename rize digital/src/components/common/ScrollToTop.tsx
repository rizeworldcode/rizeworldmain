import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const isFirstRender = useRef(true);
  const prevPathname = useRef(pathname);

  // Set manual scroll restoration so the browser does not clamp scroll prematurely on reload
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Save scroll position for the current route as user scrolls (throttled)
  useEffect(() => {
    let timeoutId: number | null = null;
    const handleScroll = () => {
      if (timeoutId) return;
      timeoutId = window.setTimeout(() => {
        if (window.scrollY > 0) {
          sessionStorage.setItem(`scroll_pos_${pathname}`, window.scrollY.toString());
        }
        timeoutId = null;
      }, 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  // Handle route changes, reloads, and hash navigation:
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

    // On initial page load or reload:
    if (isFirstRender.current) {
      isFirstRender.current = false;
      const saved = sessionStorage.getItem(`scroll_pos_${pathname}`);
      if (saved) {
        const targetY = parseFloat(saved);
        if (targetY > 0) {
          const restoreScroll = () => {
            window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
          };
          restoreScroll();
          requestAnimationFrame(restoreScroll);
          setTimeout(restoreScroll, 50);
          setTimeout(restoreScroll, 150);
          setTimeout(restoreScroll, 300);
          return;
        }
      }
      return;
    }

    // On normal route-to-route page navigation:
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      sessionStorage.removeItem(`scroll_pos_${pathname}`);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
}
