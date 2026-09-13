import type { Metadata } from 'next';
import { site } from '@/content/site';

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
).replace(/\/$/, '');

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
