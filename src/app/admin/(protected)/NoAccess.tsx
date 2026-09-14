import { SignOutButton } from './SignOutButton';

interface NoAccessProps {
  email: string | undefined;
  /** Present when the is_admin() check itself failed. */
  error?: string;
}

/**
 * Terminal screen for "signed in, but not an administrator".
 *
 * Deliberately does NOT redirect anywhere — this is the page that used to
 * bounce to /admin/login and cause a redirect loop. It explains the state and
 * offers the two ways out: sign out, or be granted access.
 */
export function NoAccess({ email, error }: NoAccessProps) {
  const schemaMissing = Boolean(
    error && /does not exist|schema cache|function/i.test(error),
  );

  return (
    <div className="adm-login">
      <div className="adm-login-box" style={{ maxWidth: 520 }}>
        <h1>{error ? 'Cannot verify your access' : 'Not an administrator'}</h1>
        <p className="adm-sub">
          You are signed in as <strong>{email ?? 'an unknown account'}</strong>,
          but this account cannot edit the site.
        </p>

        {schemaMissing ? (
          <div className="adm-note adm-note-error">
            The database is missing the admin tables. Run{' '}
            <code>supabase/schema.sql</code> in the Supabase SQL editor first,
            then reload this page.
          </div>
        ) : error ? (
          <div className="adm-note adm-note-error">
            The permission check failed: {error}
          </div>
        ) : (
          <div className="adm-note adm-note-info">
            Signing in is not enough on its own — the account also has to be
            listed in <code>admin_users</code>. In the Supabase SQL editor:
            <pre
              style={{
                marginTop: 10,
                padding: 10,
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 8,
                fontSize: '0.76rem',
                overflowX: 'auto',
              }}
            >
              {`insert into public.admin_users (user_id, email)
select id, email from auth.users
where email = '${email ?? 'you@example.com'}';`}
            </pre>
            Then reload this page.
          </div>
        )}

        <div className="adm-actions">
          <SignOutButton />
          <a className="adm-btn adm-btn-ghost" href="/admin">
            Try again
          </a>
        </div>
      </div>
    </div>
  );
}
