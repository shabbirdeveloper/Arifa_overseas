'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { navItems } from '@/content/site';
import { useScrolled } from '@/hooks/use-scrolled';
import { toggleTheme, useIsLightTheme } from '@/hooks/use-theme';

export function Nav() {
  const pathname = usePathname();
  const scrolled = useScrolled(50);
  const isLight = useIsLightTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Escape closes the mobile menu and returns focus to the toggle.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      hamburgerRef.current?.focus();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const themeLabel = `Switch to ${isLight ? 'dark' : 'light'} mode`;

  return (
    <>
      <nav id="nav" className={scrolled ? 'scrolled' : undefined}>
        <Link className="nav-logo" href="/">
          <Image
            src="/logo.png"
            alt="Arifa Overseas"
            width={650}
            height={580}
            priority
          />
          <span className="nav-logo-text">
            ARIFA <em>OVERSEAS</em>
          </span>
        </Link>

        <ul className="nav-center">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={isActive(item.href) ? 'active' : undefined}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <button
            type="button"
            className="theme-toggle as-button"
            onClick={toggleTheme}
            aria-label={themeLabel}
            title={themeLabel}
            aria-pressed={isLight}
          />

          <Link className="nav-cta" href="/contact">
            Get a Quote
          </Link>

          <button
            type="button"
            ref={hamburgerRef}
            id="hbg"
            className={`hamburger as-button${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls={menuId}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </nav>

      <div id={menuId} className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}

        <div className="mobile-theme">
          <span>{isLight ? '☀️ Light Mode' : '🌙 Dark Mode'}</span>
          <button
            type="button"
            className="theme-toggle as-button"
            style={{ marginLeft: 8 }}
            onClick={toggleTheme}
            aria-label={themeLabel}
            aria-pressed={isLight}
          />
        </div>
      </div>
    </>
  );
}
