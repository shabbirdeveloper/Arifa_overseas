import type { Metadata } from 'next';
import './admin.css';

export const metadata: Metadata = {
  title: 'Admin',
  // The admin area must never be indexed, and never appear in the sitemap.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The admin area sits outside the marketing layout's nav/footer/splash.
 *
 * Auth is NOT checked here — /admin/login lives under this path too. Each
 * protected page calls requireAdmin(), and every Server Action re-checks.
 */
export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="adm">{children}</div>;
}
