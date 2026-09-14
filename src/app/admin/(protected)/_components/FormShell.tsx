'use client';

import { useActionState, useEffect, useRef, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import type { ActionResult } from '@/lib/admin/actions';

export type AdminAction = (
  previous: ActionResult | null,
  formData: FormData,
) => Promise<ActionResult>;

export interface FieldErrors {
  fields?: Record<string, string>;
}

function Submit({ label, busyLabel }: { label: string; busyLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="adm-btn" disabled={pending}>
      {pending ? busyLabel : label}
    </button>
  );
}

function DeleteButton({ confirmText }: { confirmText: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name="intent"
      value="delete"
      className="adm-btn adm-btn-danger"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(confirmText)) event.preventDefault();
      }}
    >
      Delete
    </button>
  );
}

interface FormShellProps {
  action: AdminAction;
  /** Rendered with the current field errors so inputs can mark themselves. */
  children: (errors: Record<string, string>) => ReactNode;
  submitLabel?: string;
  busyLabel?: string;
  /** Show a Delete button that submits `intent=delete`. */
  deletable?: boolean;
  confirmText?: string;
  /** Clear the form after a successful submit — used by the "add new" forms. */
  resetOnSuccess?: boolean;
  hidden?: Record<string, string>;
}

/**
 * One form, one Server Action, inline success/error feedback.
 *
 * Progressive by design: the form posts and works without client JS; the
 * hooks only add pending states and the confirm dialog.
 */
export function FormShell({
  action,
  children,
  submitLabel = 'Save',
  busyLabel = 'Saving…',
  deletable = false,
  confirmText = 'Delete this permanently?',
  resetOnSuccess = false,
  hidden,
}: FormShellProps) {
  const [result, formAction] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (resetOnSuccess && result?.ok) formRef.current?.reset();
  }, [result, resetOnSuccess]);

  return (
    <form ref={formRef} action={formAction}>
      {hidden
        ? Object.entries(hidden).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))
        : null}

      {result ? (
        <div
          className={`adm-note ${result.ok ? 'adm-note-ok' : 'adm-note-error'}`}
          role="status"
        >
          {result.message}
        </div>
      ) : null}

      {children(result?.fields ?? {})}

      <div className="adm-actions">
        <Submit label={submitLabel} busyLabel={busyLabel} />
        {deletable ? <DeleteButton confirmText={confirmText} /> : null}
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  name: string;
  errors: Record<string, string>;
  children: ReactNode;
  hint?: string;
  wide?: boolean;
}

export function Field({ label, name, errors, children, hint, wide }: FieldProps) {
  const error = errors[name];
  return (
    <div className={`adm-field${wide ? ' adm-wide' : ''}`}>
      <label htmlFor={`f-${name}`}>{label}</label>
      {children}
      {hint ? <span className="adm-hint">{hint}</span> : null}
      {error ? <span className="adm-error">{error}</span> : null}
    </div>
  );
}
