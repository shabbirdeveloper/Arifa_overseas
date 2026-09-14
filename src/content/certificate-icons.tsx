// Icon set for certificate cards.
//
// Same rule as the job icons: the SVG markup lives here, never in the
// database. An admin storing raw SVG would be a stored-XSS vector, so the
// admin form picks a key from this list instead.
//
// The paths are the ones the certificates already used, so switching the page
// over to the database changes nothing on screen.

export const CERT_ICON_KEYS = [
  'registry',
  'money',
  'building',
  'shield-check',
  'safety',
  'clipboard-check',
  'info',
  'award',
  'people',
  'bolt',
] as const;

export type CertIconKey = (typeof CERT_ICON_KEYS)[number];

export const CERT_ICON_LABELS: Record<CertIconKey, string> = {
  registry: 'Registry / ledger',
  money: 'Finance',
  building: 'Building',
  'shield-check': 'Shield with tick',
  safety: 'Safety helmet',
  'clipboard-check': 'Clipboard with tick',
  info: 'Information',
  award: 'Award star',
  people: 'People',
  bolt: 'Lightning bolt',
};

const PATHS: Record<CertIconKey, string> = {
  registry:
    'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
  money:
    'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  building:
    'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  'shield-check':
    'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  safety:
    'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  'clipboard-check':
    'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  award:
    'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  people:
    'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  bolt: 'M13 10V3L4 14h7v7l9-11h-7z',
};

export function isCertIconKey(value: string): value is CertIconKey {
  return (CERT_ICON_KEYS as readonly string[]).includes(value);
}

/** The certificate card icon for a key, falling back to the registry mark. */
export function CertIcon({ iconKey }: { iconKey: string }) {
  const key: CertIconKey = isCertIconKey(iconKey) ? iconKey : 'registry';
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--blue)"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d={PATHS[key]} />
    </svg>
  );
}
