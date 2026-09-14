'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getBrowserClient } from '@/lib/supabase/browser';

export function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      className="adm-btn adm-btn-ghost"
      style={{ padding: '5px 12px', fontSize: '0.78rem' }}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await getBrowserClient().auth.signOut();
        router.replace('/admin/login');
        router.refresh();
      }}
    >
      {busy ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
