// Icon set for job listings.
//
// The SVG markup lives here rather than in the database on purpose: an
// admin storing raw SVG would be a stored-XSS vector. The admin form
// picks a key from this list instead.

export const JOB_ICON_KEYS = [
  'blueprint',
  'person',
  'bolt',
  'bulb',
  'cog',
  'briefcase',
  'shield',
  'pipes',
  'clipboard',
] as const;

export type JobIconKey = (typeof JOB_ICON_KEYS)[number];

export const JOB_ICON_LABELS: Record<JobIconKey, string> = {
  blueprint: 'Blueprint',
  person: 'Person',
  bolt: 'Lightning bolt',
  bulb: 'Light bulb',
  cog: 'Cog',
  briefcase: 'Briefcase',
  shield: 'Shield',
  pipes: 'Pipes',
  clipboard: 'Clipboard',
};

export const JOB_ICONS: Record<JobIconKey, React.ReactElement> = {
  blueprint: (
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" aria-hidden="true">
      <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"></path>
    </svg>
  ),
  person: (
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" aria-hidden="true">
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" aria-hidden="true">
      <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
    </svg>
  ),
  bulb: (
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" aria-hidden="true">
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
    </svg>
  ),
  cog: (
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" aria-hidden="true">
      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" aria-hidden="true">
      <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v10a2 2 0 002 2z"></path>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" aria-hidden="true">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
    </svg>
  ),
  pipes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
    </svg>
  ),
  clipboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" aria-hidden="true">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
    </svg>
  ),
};

export function isJobIconKey(value: string): value is JobIconKey {
  return (JOB_ICON_KEYS as readonly string[]).includes(value);
}
