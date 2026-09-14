import { Suspense } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { LoginForm } from './LoginForm';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  return (
    <div className="adm-login">
      <div className="adm-login-box">
        <h1>Arifa Overseas admin</h1>
        <p className="adm-sub">Sign in to manage the site content.</p>

        {isSupabaseConfigured ? (
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        ) : (
          <div className="adm-note adm-note-error">
            Supabase is not configured for this deployment. Add
            <code> NEXT_PUBLIC_SUPABASE_URL </code> and
            <code> NEXT_PUBLIC_SUPABASE_ANON_KEY </code> to the environment,
            then redeploy. The public site keeps working from its content files
            in the meantime.
          </div>
        )}
      </div>
    </div>
  );
}
