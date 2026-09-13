'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const REVEAL_SELECTOR = [
  '.s3d',
  '.s3d-l',
  '.s3d-r',
  '.s3d-p',
  '.s3d-left',
  '.s3d-right',
  '.s3d-pop',
].join(', ');

/**
 * Adds `.in` to reveal elements as they scroll into view, the same way the
 * legacy site did — re-run on every route change because the DOM is replaced.
 *
 * Elements are revealed immediately (no observer) when the visitor prefers
 * reduced motion, and a <noscript> rule in the layout reveals everything when
 * JavaScript never runs at all.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
    );
    if (elements.length === 0) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      elements.forEach((element) => element.classList.add('in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' },
    );

    elements.forEach((element) => {
      element.classList.remove('in');
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
