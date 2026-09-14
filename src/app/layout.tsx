import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { site } from '@/content/site';
import { siteUrl } from '@/lib/seo';
import './globals.css';

/**
 * Inter, self-hosted as a variable font (latin subset, ~48KB).
 *
 * The legacy site pulled six static weights from fonts.googleapis.com on every
 * visit: a render-blocking third-party request, and a privacy concern under
 * GDPR/PDPA since it hands the visitor's IP to Google. Serving it from our own
 * origin is faster, works offline, and needs no external allow-list.
 */
const inter = localFont({
  src: [
    {
      path: '../fonts/inter-latin-variable.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../fonts/inter-latin-variable-italic.woff2',
      weight: '100 900',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.legalName,
  keywords: [
    'construction company Johor Bahru',
    'manpower supply Malaysia',
    'CIDB G7 contractor',
    'labour supply Johor',
    'facility maintenance Malaysia',
    'steel fabrication Johor',
    'EPCC contractor Malaysia',
  ],
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  publisher: site.legalName,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en_MY',
    url: '/',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [{ url: '/logo.png', alt: site.legalName }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  // No maximum-scale: the legacy site blocked pinch-zoom (WCAG 1.4.4).
  width: 'device-width',
  initialScale: 1,
  themeColor: '#060a0f',
};

/**
 * Runs before first paint (hence inline, and before React hydrates):
 *  1. applies the saved theme, so light-mode visitors never see a flash of the
 *     dark palette;
 *  2. stamps data-splash="skip" when the splash has already been shown this
 *     session or the visitor prefers reduced motion, so CSS can hide it with
 *     no flicker.
 */
const bootScript = `(function(){try{if(localStorage.getItem('theme')==='light'){document.documentElement.setAttribute('data-theme','light')}}catch(e){}
try{if(sessionStorage.getItem('splash-seen')==='1'||window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.setAttribute('data-splash','skip')}}catch(e){}})();`;

const themeBodyScript = `(function(){try{if(document.documentElement.getAttribute('data-theme')==='light'){document.body.classList.add('light-theme')}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-MY" className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        {/* Second half of the theme step — <body> does not exist yet in <head>. */}
        <script dangerouslySetInnerHTML={{ __html: themeBodyScript }} />
        {children}
      </body>
    </html>
  );
}
