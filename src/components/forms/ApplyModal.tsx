'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { experienceOptions } from '@/content/site';
import { RESUME_ACCEPT, RESUME_MAX_BYTES } from '@/lib/validation';

interface ApplyModalProps {
  position: string;
  onClose: () => void;
}

interface ApiError {
  error?: string;
  fields?: Record<string, string>;
}

export function ApplyModal({ position, onClose }: ApplyModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [fieldIssues, setFieldIssues] = useState<Record<string, string>>({});

  const boxRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Focus management, Escape to close, Tab trapped inside, scroll locked.
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = boxRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus();
    };
  }, [onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setFieldIssues({});

    const form = event.currentTarget;
    const data = new FormData(form);

    const resume = data.get('resume');
    if (resume instanceof File && resume.size > RESUME_MAX_BYTES) {
      setFieldIssues({ resume: 'Maximum file size is 5MB.' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/apply', { method: 'POST', body: data });
      const payload = (await response.json().catch(() => ({}))) as ApiError;

      if (!response.ok) {
        setError(
          payload.error ??
            'Could not send right now. Please try again, or contact us on WhatsApp.',
        );
        if (payload.fields) setFieldIssues(payload.fields);
        return;
      }

      setSent(true);
    } catch {
      setError(
        'Could not send right now. Please check your connection, or contact us on WhatsApp.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="modal-overlay open"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={boxRef}
        className="modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-title"
      >
        <button
          type="button"
          ref={closeRef}
          className="modal-close"
          onClick={onClose}
          aria-label="Close application form"
        >
          ✕
        </button>

        <div className="modal-header">
          <div className="modal-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--blue)"
              strokeWidth="1.8"
              width="28"
              height="28"
              aria-hidden="true"
            >
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 id="apply-title">
              Apply for{' '}
              <em style={{ color: 'var(--blue)', fontStyle: 'normal' }}>
                {position}
              </em>
            </h3>
            <p>Fill in your details and we&rsquo;ll contact you within 48 hours.</p>
          </div>
        </div>

        <div className="modal-body">
          {sent ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }} role="status">
              <div style={{ fontSize: '3rem', marginBottom: 10 }}>✅</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: 6 }}>
                Application Sent!
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>
                Thank you! Our HR team will contact you within 48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <input type="hidden" name="position" value={position} />

              {/* Honeypot — hidden from people, irresistible to bots. */}
              <div className="hp-field" aria-hidden="true">
                <label htmlFor="ap-company">Company</label>
                <input
                  id="ap-company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="frow">
                <div className="fg">
                  <label htmlFor="ap-name">Full Name *</label>
                  <input
                    id="ap-name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    autoComplete="name"
                    required
                    aria-invalid={fieldIssues.name ? true : undefined}
                  />
                  {fieldIssues.name ? (
                    <span className="field-error">{fieldIssues.name}</span>
                  ) : null}
                </div>
                <div className="fg">
                  <label htmlFor="ap-phone">Phone *</label>
                  <input
                    id="ap-phone"
                    name="phone"
                    type="tel"
                    placeholder="+60 12-345 6789"
                    autoComplete="tel"
                    required
                    aria-invalid={fieldIssues.phone ? true : undefined}
                  />
                  {fieldIssues.phone ? (
                    <span className="field-error">{fieldIssues.phone}</span>
                  ) : null}
                </div>
              </div>

              <div className="fg">
                <label htmlFor="ap-email">Email Address *</label>
                <input
                  id="ap-email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                  aria-invalid={fieldIssues.email ? true : undefined}
                />
                {fieldIssues.email ? (
                  <span className="field-error">{fieldIssues.email}</span>
                ) : null}
              </div>

              <div className="fg">
                <label htmlFor="ap-exp">Years of Experience</label>
                <select id="ap-exp" name="experience" defaultValue="">
                  <option value="">Select...</option>
                  {experienceOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="fg">
                <label htmlFor="ap-resume">Attach your CV</label>
                <input
                  id="ap-resume"
                  name="resume"
                  type="file"
                  accept={RESUME_ACCEPT}
                  aria-describedby="ap-resume-hint"
                  aria-invalid={fieldIssues.resume ? true : undefined}
                />
                <span id="ap-resume-hint" className="field-hint">
                  PDF or Word document, up to 5MB. Optional.
                </span>
                {fieldIssues.resume ? (
                  <span className="field-error">{fieldIssues.resume}</span>
                ) : null}
              </div>

              <div className="fg">
                <label htmlFor="ap-msg">Tell Us About Yourself</label>
                <textarea
                  id="ap-msg"
                  name="about"
                  placeholder="Briefly describe your experience, skills, and why you want to join Arifa Overseas..."
                  style={{ minHeight: 90 }}
                />
              </div>

              {error ? (
                <div
                  role="alert"
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 8,
                    padding: 10,
                    fontSize: '0.8rem',
                    color: '#f87171',
                    marginBottom: 10,
                  }}
                >
                  ⚠️ {error}
                </div>
              ) : null}

              <button
                type="submit"
                className="fsub"
                style={{ marginTop: 4 }}
                disabled={submitting}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="17"
                  height="17"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {submitting ? 'Sending…' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
