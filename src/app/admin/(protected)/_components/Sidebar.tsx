'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import {
  IconCertificate,
  IconDashboard,
  IconExternal,
  IconHistory,
  IconJobs,
  IconProjects,
  IconTeam,
} from './icons';
import { SignOutButton } from '../SignOutButton';

export interface SectionCounts {
  team: number;
  projects: number;
  history: number;
  jobs: number;
  certificates: number;
}

const SECTIONS: Array<{
  href: string;
  label: string;
  icon: ReactNode;
  key?: keyof SectionCounts;
}> = [
  { href: '/admin', label: 'Dashboard', icon: <IconDashboard /> },
  { href: '/admin/team', label: 'Team', icon: <IconTeam />, key: 'team' },
  {
    href: '/admin/projects',
    label: 'Featured projects',
    icon: <IconProjects />,
    key: 'projects',
  },
  {
    href: '/admin/history',
    label: 'Project history',
    icon: <IconHistory />,
    key: 'history',
  },
  { href: '/admin/jobs', label: 'Jobs', icon: <IconJobs />, key: 'jobs' },
  {
    href: '/admin/certificates',
    label: 'Certificates',
    icon: <IconCertificate />,
    key: 'certificates',
  },
];

function initials(email: string | undefined): string {
  if (!email) return '?';
  return email.slice(0, 2);
}

export function Sidebar({
  counts,
  email,
}: {
  counts: SectionCounts;
  email: string | undefined;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <aside className="adm-rail">
      <Link href="/admin" className="adm-rail-brand">
        <span className="adm-rail-mark" aria-hidden="true">
          AO
        </span>
        <span className="adm-rail-name">
          <strong>Arifa Overseas</strong>
          <span>Content admin</span>
        </span>
      </Link>

      <div className="adm-rail-label">Manage</div>

      <nav aria-label="Admin sections">
        <ul className="adm-rail-nav">
          {SECTIONS.map((section) => (
            <li key={section.href}>
              <Link
                href={section.href}
                className="adm-rail-link"
                aria-current={isActive(section.href) ? 'page' : undefined}
              >
                {section.icon}
                {section.label}
                {section.key ? (
                  <span className="adm-rail-count">{counts[section.key]}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="adm-rail-foot">
        <a
          className="adm-rail-link"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconExternal />
          View website
        </a>

        <div className="adm-rail-user">
          <span className="adm-avatar" aria-hidden="true">
            {initials(email)}
          </span>
          <span className="adm-rail-user-meta">
            <strong title={email}>{email ?? 'Signed in'}</strong>
            <span>Administrator</span>
          </span>
        </div>

        <SignOutButton full />
      </div>
    </aside>
  );
}
