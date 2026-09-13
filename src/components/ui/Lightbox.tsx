'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface LightboxProps {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  /** `contain` keeps document scans legible; the gallery uses the same. */
  onClose: () => void;
  /** Extra width cap for certificate scans. */
  variant?: 'photo' | 'document';
}

/**
 * Accessible image lightbox: closes on Escape, on backdrop click and on the
 * close button, traps Tab inside itself and restores focus to whatever opened
 * it. The legacy modals did none of this.
 */
export function Lightbox({
  src,
  alt,
  caption,
  width,
  height,
  onClose,
  variant = 'photo',
}: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
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

  const isDocument = variant === 'document';

  return (
    <div
      className="modal-overlay open"
      style={{ zIndex: 3000, padding: isDocument ? 20 : undefined }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={caption || alt}
        style={
          isDocument
            ? { maxWidth: 860, width: '96vw', position: 'relative' }
            : { maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }
        }
      >
        <button
          type="button"
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: isDocument ? -42 : -40,
            right: 0,
            background: 'rgba(56,189,248,0.15)',
            border: '1px solid rgba(56,189,248,0.3)',
            color: 'white',
            width: isDocument ? 34 : 32,
            height: isDocument ? 34 : 32,
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 900px) 96vw, 860px"
          style={
            isDocument
              ? {
                  width: '100%',
                  height: 'auto',
                  maxHeight: '82vh',
                  objectFit: 'contain',
                  borderRadius: 12,
                  display: 'block',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                }
              : {
                  maxWidth: '90vw',
                  maxHeight: '85vh',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: 10,
                  display: 'block',
                }
          }
        />

        {caption ? (
          <div
            style={{
              textAlign: 'center',
              marginTop: isDocument ? 12 : 10,
              fontSize: '0.85rem',
              color: 'var(--light)',
              fontWeight: isDocument ? 300 : undefined,
              letterSpacing: isDocument ? '0.5px' : undefined,
            }}
          >
            {caption}
          </div>
        ) : null}
      </div>
    </div>
  );
}
