'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { getBrowserClient } from '@/lib/supabase/browser';

const MESSAGES: Record<string, string> = {
  'not-admin':
    'That account is signed in but is not an administrator. Ask for your user to be added to admin_users.',
  'check-failed':
    'Could not verify your permissions. Please try signing in again.',
};

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(MESSAGES[params.get('error') ?? ''] ?? '');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);

    const supabase = getBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      // Deliberately vague: distinguishing "no such user" from "wrong password"
      // tells an attacker which emails exist.
      setError('Those details did not work. Please check and try again.');
      setBusy(false);
      return;
    }

    const next = params.get('next');
    const target = next && next.startsWith('/admin') ? next : '/admin';

    // refresh() so the server components re-run with the new session cookie.
    router.replace(target);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error ? (
        <div className="adm-note adm-note-error" role="alert">
          {error}
        </div>
      ) : null}

      <div className="adm-field" style={{ marginBottom: 14 }}>
        <label htmlFor="adm-email">Email</label>
        <input
          id="adm-email"
          type="email"
          name="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="adm-field" style={{ marginBottom: 18 }}>
        <label htmlFor="adm-password">Password</label>
        <input
          id="adm-password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <button type="submit" className="adm-btn" disabled={busy} style={{ width: '100%', justifyContent: 'center' }}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
