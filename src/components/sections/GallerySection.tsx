'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Lightbox } from '@/components/ui/Lightbox';
import {
  galleryFilters,
  galleryItems,
  type GalleryItemWithSize,
} from '@/content/gallery';

export function GallerySection() {
  const [filter, setFilter] = useState<string>('all');
  const [active, setActive] = useState<GalleryItemWithSize | null>(null);

  const visible = useMemo(
    () =>
      filter === 'all'
        ? galleryItems
        : galleryItems.filter((item) => item.category === filter),
    [filter],
  );

  return (
    <>
      <div
        className="gal-filter s3d"
        style={{ display: 'flex', gap: 9, marginBottom: 36, flexWrap: 'wrap' }}
        role="group"
        aria-label="Filter gallery by category"
      >
        {galleryFilters.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`job-filter-btn${filter === option.value ? ' active' : ''}`}
            onClick={() => setFilter(option.value)}
            aria-pressed={filter === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {visible.map((item, index) => (
          <div
            key={item.src + item.title}
            className={`gal-item s3d d${(index % 3) + 1}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
            />
            <div className="gal-overlay">
              <div className="gal-info">
                <div className="gal-cat">{item.categoryLabel}</div>
                <h4>{item.title}</h4>
              </div>
              <div className="gal-zoom" aria-hidden="true">
                🔍
              </div>
            </div>
            {/* Stretched hit area: keeps the tile a <div> (so the <h4> stays
                valid HTML) while the click target is a real button. */}
            <button
              type="button"
              className="tile-open as-button"
              onClick={() => setActive(item)}
              aria-label={`View ${item.title}`}
            />
          </div>
        ))}
      </div>

      {visible.length === 0 ? (
        <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
          No photos in this category yet.
        </p>
      ) : null}

      {active ? (
        <Lightbox
          src={active.src}
          alt={active.alt}
          caption={active.title}
          width={active.width}
          height={active.height}
          onClose={() => setActive(null)}
        />
      ) : null}
    </>
  );
}
