'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getBrowserClient } from '@/lib/supabase/browser';

export function SignOutButton({ full = false }: { full?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      className={`adm-btn adm-btn-ghost${full ? '' : ' adm-btn-sm'}`}
      style={full ? { width: '100%' } : undefined}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await getBrowserClient().auth.signOut();
        router.replace('/admin/login');
        router.refresh();
      }}
    >
      {busy ? <span className="adm-spinner" /> : null}
      {busy ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
