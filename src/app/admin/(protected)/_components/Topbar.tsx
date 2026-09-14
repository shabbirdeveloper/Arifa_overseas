'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/team': 'Team',
  '/admin/projects': 'Featured projects',
  '/admin/history': 'Project history',
  '/admin/jobs': 'Jobs',
};

/** Where each section's content appears on the public site. */
const PREVIEW: Record<string, string> = {
  '/admin/team': '/about',
  '/admin/projects': '/projects',
  '/admin/history': '/projects',
  '/admin/jobs': '/careers',
};

export function Topbar() {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? 'Admin';
  const preview = PREVIEW[pathname];

  return (
    <header className="adm-topbar">
      <div className="adm-crumb">
        <Link href="/admin">Admin</Link>
        {pathname !== '/admin' ? (
          <>
            <span className="adm-crumb-sep" aria-hidden="true">
              /
            </span>
            <strong>{title}</strong>
          </>
        ) : null}
      </div>

      {preview ? (
        <div className="adm-topbar-actions">
          <a
            className="adm-btn adm-btn-ghost adm-btn-sm"
            href={preview}
            target="_blank"
            rel="noopener noreferrer"
          >
            Preview {preview}
          </a>
        </div>
      ) : null}
    </header>
  );
}
