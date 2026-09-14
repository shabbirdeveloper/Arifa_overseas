import Link from 'next/link';
import { checkAdminAccess } from '@/lib/admin/guard';
import { NoAccess } from './NoAccess';
import { SignOutButton } from './SignOutButton';

export const dynamic = 'force-dynamic';

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/team', label: 'Team' },
  { href: '/admin/projects', label: 'Featured projects' },
  { href: '/admin/history', label: 'Project history' },
  { href: '/admin/jobs', label: 'Jobs' },
];

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // The real gate. Middleware also checks, but middleware is not a boundary.
  const access = await checkAdminAccess();

  // Signed in, but not allowed: explain it here rather than redirecting.
  if (access.status === 'not-admin') {
    return <NoAccess email={access.user.email} />;
  }

  if (access.status === 'check-failed') {
    return <NoAccess email={access.user.email} error={access.message} />;
  }

  return (
    <>
      <header className="adm-bar">
        <Link href="/admin" className="adm-brand">
          ARIFA <em>ADMIN</em>
        </Link>

        <nav aria-label="Admin sections">
          <ul className="adm-nav">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="adm-bar-right">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            View site ↗
          </Link>
          <span>{access.user.email}</span>
          <SignOutButton />
        </div>
      </header>

      <main className="adm-main">{children}</main>
    </>
  );
}
