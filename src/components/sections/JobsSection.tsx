'use client';

import { useMemo, useState } from 'react';
import { ApplyModal } from '@/components/forms/ApplyModal';
import { JOB_ICONS } from '@/content/job-icons';
import type { Job } from '@/lib/data/jobs';

const JOB_FILTERS = [
  { value: 'all', label: 'All Jobs' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'skilled', label: 'Skilled Trades' },
  { value: 'general', label: 'General' },
  { value: 'management', label: 'Management' },
] as const;

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" aria-hidden="true">
    <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" aria-hidden="true">
    <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CoinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" aria-hidden="true">
    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1" />
  </svg>
);

export function JobsSection({ jobs }: { jobs: Job[] }) {
  const [filter, setFilter] = useState<string>('all');
  const [applyFor, setApplyFor] = useState<string | null>(null);

  const visible = useMemo(
    () => (filter === 'all' ? jobs : jobs.filter((job) => job.category === filter)),
    [filter, jobs],
  );

  return (
    <>
      <div className="job-filter s3d" role="group" aria-label="Filter jobs by department">
        {JOB_FILTERS.map((option) => (
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

      <div className="jobs-grid">
        {visible.map((job, index) => (
          <div
            key={job.id}
            id={job.slug}
            className={`job-card s3d d${(index % 3) + 1}`}
          >
            <div className="job-header">
              <div
                className="job-icon"
                style={{ background: 'rgba(56,189,248,0.12)' }}
                aria-hidden="true"
              >
                {JOB_ICONS[job.iconKey]}
              </div>
              <div>
                <div className="job-cat-tag">{job.categoryLabel}</div>
                <h3 className="job-title">{job.title}</h3>
              </div>
            </div>

            <div className="job-details">
              <span className="job-detail">
                <PinIcon /> {job.location}
              </span>
              <span className="job-detail">
                <BriefcaseIcon /> {job.employmentType}
              </span>
              <span className="job-detail">
                <CoinIcon /> {job.salary}
              </span>
            </div>

            <ul className="job-reqs">
              {job.requirements.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>

            <button
              type="button"
              className="job-apply-btn"
              onClick={() => setApplyFor(job.title)}
            >
              Apply Now →
            </button>
          </div>
        ))}
      </div>

      {visible.length === 0 ? (
        <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
          No openings in this department right now — send us a general
          application and we&rsquo;ll keep your CV on file.
        </p>
      ) : null}

      <div
        className="s3d"
        style={{
          marginTop: 44,
          background: 'var(--steel)',
          border: '1px solid rgba(56,189,248,0.12)',
          borderRadius: 14,
          padding: '26px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 500, marginBottom: 4 }}>
            Don&rsquo;t see your role?
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray)', fontWeight: 300 }}>
            Send us your CV anyway — we hire continuously across all trades.
          </p>
        </div>
        <button
          type="button"
          className="job-apply-btn"
          style={{ flexShrink: 0, margin: 0, width: 'auto' }}
          onClick={() => setApplyFor('General Application')}
        >
          Send CV →
        </button>
      </div>

      {applyFor ? (
        <ApplyModal position={applyFor} onClose={() => setApplyFor(null)} />
      ) : null}
    </>
  );
}
