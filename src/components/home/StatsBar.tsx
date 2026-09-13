'use client';

import { useEffect, useRef, useState } from 'react';
import { site } from '@/content/site';

interface Stat {
  target: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  { target: site.stats.years, suffix: '+', label: 'Years Experience' },
  { target: site.stats.projects, suffix: '+', label: 'Projects Completed' },
  { target: site.stats.workers, suffix: '+', label: 'Workers Deployed' },
  { target: site.stats.satisfaction, suffix: '%', label: '% Client Satisfaction' },
];

function StatItem({ stat, delay }: { stat: Stat; delay: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let interval = 0;

    const run = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setValue(stat.target);
        return;
      }

      const step = Math.max(1, Math.ceil(stat.target / 70));
      let current = 0;

      interval = window.setInterval(() => {
        current = Math.min(current + step, stat.target);
        setValue(current);
        if (current >= stat.target) window.clearInterval(interval);
      }, 20);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        run();
      },
      { threshold: 0.5 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
    };
  }, [stat.target]);

  return (
    <div ref={ref} className={`stat-item s3d${delay}`}>
      {/* The number animates, so it is hidden from assistive tech; the label
          carries the final figure instead. */}
      <div className="stat-num" aria-hidden="true">
        {value}
        {stat.suffix}
      </div>
      <div className="stat-label">
        <span className="sr-only">
          {stat.target}
          {stat.suffix}{' '}
        </span>
        {stat.label}
      </div>
    </div>
  );
}

export function StatsBar() {
  return (
    <div className="stats-bar">
      <div className="stats-inner">
        {STATS.map((stat, index) => (
          <StatItem
            key={stat.label}
            stat={stat}
            delay={index === 0 ? '' : ` d${index}`}
          />
        ))}
      </div>
    </div>
  );
}
