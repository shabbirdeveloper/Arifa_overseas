'use client';

import { useEffect, useState } from 'react';
import { heroSlides } from '@/content/site';

/** Cross-fading hero background, 5s per slide (matches the legacy timing). */
export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (heroSlides.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % heroSlides.length),
      5000,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="hero-carousel" aria-hidden="true">
      {heroSlides.map((src, slideIndex) => (
        <div
          key={src}
          className={`hero-slide${slideIndex === index ? ' active' : ''}`}
          style={{ backgroundImage: `url('${src}')` }}
        />
      ))}
    </div>
  );
}
