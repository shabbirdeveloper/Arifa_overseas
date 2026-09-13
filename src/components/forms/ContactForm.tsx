'use client';

import { useState, type FormEvent } from 'react';
import { serviceOptions } from '@/content/site';

interface ApiError {
  error?: string;
  fields?: Record<string, string>;
}

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [fieldIssues, setFieldIssues] = useState<Record<string, string>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setFieldIssues({});
    setSubmitting(true);

    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('name') ?? ''),
          phone: String(data.get('phone') ?? ''),
          email: String(data.get('email') ?? ''),
          service: String(data.get('service') ?? ''),
          message: String(data.get('message') ?? ''),
          company: String(data.get('company') ?? ''),
        }),
      });

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
    <div className="c-form s3d-right">
      <h3>Send Us a Message</h3>
      <p>Fill in your details and we&rsquo;ll get back to you within 24 hours.</p>

      {sent ? (
        <div
          role="status"
          style={{
            background: 'rgba(13,148,136,0.15)',
            border: '1px solid rgba(13,148,136,0.4)',
            borderRadius: 10,
            padding: 20,
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
          <h4 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: 6 }}>
            Message Sent Successfully!
          </h4>
          <p style={{ fontSize: '0.83rem', color: 'var(--gray)' }}>
            Thank you! We will respond within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {/* Honeypot — hidden from people, irresistible to bots. */}
          <div className="hp-field" aria-hidden="true">
            <label htmlFor="f-company">Company</label>
            <input
              id="f-company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="frow">
            <div className="fg">
              <label htmlFor="f-name">Your Name *</label>
              <input
                id="f-name"
                name="name"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                required
                aria-invalid={fieldIssues.name ? true : undefined}
              />
              {fieldIssues.name ? (
                <span className="field-error">{fieldIssues.name}</span>
              ) : null}
            </div>
            <div className="fg">
              <label htmlFor="f-phone">Phone *</label>
              <input
                id="f-phone"
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
            <label htmlFor="f-email">Email Address *</label>
            <input
              id="f-email"
              name="email"
              type="email"
              placeholder="john@company.com"
              autoComplete="email"
              required
              aria-invalid={fieldIssues.email ? true : undefined}
            />
            {fieldIssues.email ? (
              <span className="field-error">{fieldIssues.email}</span>
            ) : null}
          </div>

          <div className="fg">
            <label htmlFor="f-service">Service Required</label>
            <select id="f-service" name="service" defaultValue="">
              <option value="">Select a service...</option>
              {serviceOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="fg">
            <label htmlFor="f-message">Project Details</label>
            <textarea
              id="f-message"
              name="message"
              placeholder="Tell us about your project, timeline, location, and requirements..."
            />
          </div>

          {error ? (
            <div
              role="alert"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 8,
                padding: 12,
                fontSize: '0.82rem',
                color: '#f87171',
                marginBottom: 12,
              }}
            >
              ⚠️ {error}
            </div>
          ) : null}

          <button type="submit" className="fsub" disabled={submitting}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {submitting ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}
