import type { Metadata } from 'next';
import { site } from '@/content/site';

/**
 * Canonical base URL.
 *
 * Resolved defensively because a wrong value here fails the build rather than
 * degrading: an env var that exists but is empty, or a domain typed without a
 * protocol, both produce `new URL(...)` TypeErrors during metadata collection.
 *
 * Order of preference:
 *   1. NEXT_PUBLIC_SITE_URL — set this to the real domain in production.
 *   2. Vercel's own deployment URL, so preview builds still work unset.
 *   3. localhost, for development.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    const withProtocol = /^https?:\/\//i.test(explicit)
      ? explicit
      : `https://${explicit}`;
    return withProtocol.replace(/\/+$/, '');
  }

  // Set automatically by Vercel; not prefixed NEXT_PUBLIC_, so server-only.
  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();

  if (vercelHost) {
    return `https://${vercelHost.replace(/^https?:\/\//i, '').replace(/\/+$/, '')}`;
  }

  return 'http://localhost:3000';
}

export const siteUrl = resolveSiteUrl();

export const absoluteUrl = (path = '/') =>
  `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  /** Absolute or root-relative image for social cards. */
  image?: string;
}

/** Per-route metadata with canonical URL and Open Graph / Twitter cards. */
export function pageMeta({
  title,
  description,
  path,
  image = '/logo.png',
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image.startsWith('http') ? image : absoluteUrl(image);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: 'en_MY',
      title,
      description,
      url,
      images: [{ url: ogImage, alt: site.legalName }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}
