'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

/**
 * Intro splash.
 *
 * It is rendered on the server so there is no pop-in, and the blocking script
 * in the document head stamps `data-splash="skip"` on <html> when the visitor
 * has already seen it this session or prefers reduced motion — CSS then hides
 * it before first paint. A <noscript> rule hides it outright when JavaScript
 * never runs; in the legacy site a JS failure left it covering the page.
 */
export function Splash() {
  const [state, setState] = useState<'visible' | 'hiding' | 'gone'>('visible');

  useEffect(() => {
    try {
      window.sessionStorage.setItem('splash-seen', '1');
    } catch {
      // Storage blocked — the splash simply shows again next navigation.
    }

    const startHiding = () => setState('hiding');
    const hideTimer = window.setTimeout(startHiding, 1400);
    const removeTimer = window.setTimeout(() => setState('gone'), 2300);

    window.addEventListener('pointerdown', startHiding, { once: true });
    window.addEventListener('keydown', startHiding, { once: true });

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
      window.removeEventListener('pointerdown', startHiding);
      window.removeEventListener('keydown', startHiding);
    };
  }, []);

  if (state === 'gone') return null;

  return (
    <div
      id="splash"
      className={state === 'hiding' ? 'hide' : undefined}
      aria-hidden="true"
    >
      <div className="sp-ring">
        <svg className="sp-svg" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke="rgba(56,189,248,0.12)"
            strokeWidth="3"
          />
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="444"
            strokeDashoffset="148"
            transform="rotate(-90 100 100)"
            style={{ filter: 'drop-shadow(0 0 6px #38bdf8)' }}
          />
        </svg>
        <div className="sp-logo-bg">
          <Image
            className="sp-logo"
            src="/logo.png"
            alt=""
            width={650}
            height={580}
            priority
          />
        </div>
      </div>
      <div className="sp-name">
        <em>Arifa</em> Overseas
      </div>
      <div className="sp-tagline">Construction &amp; Manpower Supply</div>
    </div>
  );
}
