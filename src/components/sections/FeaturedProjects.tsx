'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { featuredProjects, projectFilters } from '@/content/projects';

/**
 * The legacy filter buttons had no click handler at all — they looked
 * interactive and did nothing. They filter for real now.
 */
export function FeaturedProjects() {
  const [filter, setFilter] = useState<string>('all');

  const visible = useMemo(
    () =>
      filter === 'all'
        ? featuredProjects
        : featuredProjects.filter((project) => project.category === filter),
    [filter],
  );

  return (
    <>
      <div className="filter-bar s3d" role="group" aria-label="Filter projects by type">
        {projectFilters.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`filter-btn${filter === option.value ? ' active' : ''}`}
            onClick={() => setFilter(option.value)}
            aria-pressed={filter === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="proj-masonry">
        {visible.map((project, index) => (
          <div
            key={project.title}
            className={`proj-item${project.tall ? ' tall' : ''} ${
              index === 0 ? 's3d-left' : `s3d d${(index % 2) + 1}`
            }`}
          >
            <Image
              src={project.src}
              alt={project.alt}
              className="proj-img"
              width={project.width}
              height={project.height}
              sizes="(max-width: 700px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading={index < 3 ? undefined : 'lazy'}
            />
            <div className="proj-ov" />
            <div className="proj-info">
              <div className="proj-cat">{project.category}</div>
              <h3>{project.title}</h3>
              <p>{project.text}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
