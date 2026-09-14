'use client';

import { useId, useRef, useState } from 'react';
import { getBrowserClient } from '@/lib/supabase/browser';

interface ImageFieldProps {
  /** Names of the hidden inputs submitted with the form. */
  name: string;
  widthName: string;
  heightName: string;
  label?: string;
  initialUrl?: string | null;
  initialWidth?: number | null;
  initialHeight?: number | null;
  /** Sub-folder inside the storage bucket, e.g. 'team' or 'projects'. */
  folder: string;
  required?: boolean;
  error?: string;
}

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

/** Reads the real pixel dimensions before upload, so next/image can reserve space. */
async function readDimensions(file: File): Promise<{ width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return size;
}

function safeName(original: string): string {
  const dot = original.lastIndexOf('.');
  const ext = dot > -1 ? original.slice(dot + 1).toLowerCase() : 'jpg';
  const stem = (dot > -1 ? original.slice(0, dot) : original)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image';
  // A timestamp keeps uploads unique, so re-uploading never overwrites a file
  // another row still points at.
  return `${stem}-${Date.now()}.${ext.replace(/[^a-z0-9]/g, '') || 'jpg'}`;
}

/**
 * Uploads straight from the browser to Supabase Storage and records the
 * resulting public URL plus dimensions in hidden inputs.
 *
 * Going browser → Storage directly keeps multi-megabyte files out of the
 * Server Action request body (Vercel caps that at 4.5MB) and means the upload
 * is still governed by Storage RLS — the signed-in user must be an admin.
 */
export function ImageField({
  name,
  widthName,
  heightName,
  label = 'Image',
  initialUrl,
  initialWidth,
  initialHeight,
  folder,
  required = false,
  error,
}: ImageFieldProps) {
  const [url, setUrl] = useState(initialUrl ?? '');
  const [width, setWidth] = useState(initialWidth ?? 0);
  const [height, setHeight] = useState(initialHeight ?? 0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  async function handleFile(file: File) {
    setMessage('');

    if (!ACCEPTED.includes(file.type)) {
      setMessage('Use a JPG, PNG, WebP or AVIF image.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setMessage('That image is larger than 5MB.');
      return;
    }

    setBusy(true);
    try {
      const dimensions = await readDimensions(file);
      const path = `${folder}/${safeName(file.name)}`;
      const supabase = getBrowserClient();

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(path, file, { cacheControl: '31536000', upsert: false });

      if (uploadError) {
        setMessage(`Upload failed: ${uploadError.message}`);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('site-images').getPublicUrl(path);

      setUrl(publicUrl);
      setWidth(dimensions.width);
      setHeight(dimensions.height);
      setMessage('Uploaded. Remember to save.');
    } catch {
      setMessage('Could not read that image. Try a different file.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="adm-field adm-wide">
      <label htmlFor={id}>{label}</label>

      <div className="adm-image">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="adm-image-preview" />
        ) : (
          <div className="adm-image-empty">No image</div>
        )}

        <div className="adm-image-controls">
          <input
            id={id}
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(',')}
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />

          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="…or paste an image URL"
            aria-label={`${label} URL`}
          />

          <span className="adm-hint">
            {busy
              ? 'Uploading…'
              : width > 0
                ? `${width} × ${height}px. JPG, PNG, WebP or AVIF, up to 5MB.`
                : 'JPG, PNG, WebP or AVIF, up to 5MB.'}
          </span>

          {message ? <span className="adm-hint">{message}</span> : null}
          {error ? <span className="adm-error">{error}</span> : null}
        </div>
      </div>

      <input type="hidden" name={name} value={url} required={required} />
      <input type="hidden" name={widthName} value={width || ''} />
      <input type="hidden" name={heightName} value={height || ''} />
    </div>
  );
}
