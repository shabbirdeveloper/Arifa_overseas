import Link from 'next/link';
import { Suspense } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { createSessionClient } from '@/lib/supabase/server';
import { LoginForm } from './LoginForm';
import { SignOutButton } from '../(protected)/SignOutButton';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  // Detect an existing session here rather than redirecting in middleware:
  // middleware cannot tell an admin from a signed-in stranger, and guessing
  // wrong there produced a redirect loop.
  let signedInAs: string | null = null;

  if (isSupabaseConfigured) {
    const supabase = await createSessionClient();
    const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
    signedInAs = data.user?.email ?? null;
  }

  return (
    <div className="adm-login">
      <div className="adm-login-box">
        <h1>Arifa Overseas admin</h1>
        <p className="adm-sub">Sign in to manage the site content.</p>

        {!isSupabaseConfigured ? (
          <div className="adm-note adm-note-error">
            Supabase is not configured for this deployment. Add
            <code> NEXT_PUBLIC_SUPABASE_URL </code> and
            <code> NEXT_PUBLIC_SUPABASE_ANON_KEY </code> to the environment,
            then redeploy. The public site keeps working from its content files
            in the meantime.
          </div>
        ) : signedInAs ? (
          <>
            <div className="adm-note adm-note-info">
              You are already signed in as <strong>{signedInAs}</strong>.
            </div>
            <div className="adm-actions">
              <Link className="adm-btn" href="/admin">
                Continue to the dashboard
              </Link>
              <SignOutButton />
            </div>
          </>
        ) : (
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        )}
      </div>
    </div>
  );
}
