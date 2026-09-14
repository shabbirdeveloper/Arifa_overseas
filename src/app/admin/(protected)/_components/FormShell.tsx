'use client';

import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useFormStatus } from 'react-dom';
import type { ActionResult } from '@/lib/admin/actions';

export type AdminAction = (
  previous: ActionResult | null,
  formData: FormData,
) => Promise<ActionResult>;

function Submit({ label, busyLabel }: { label: string; busyLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="adm-btn" disabled={pending}>
      {pending ? <span className="adm-spinner" aria-hidden="true" /> : null}
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

/** Clears the dirty flag the moment a submit starts, so it never sticks. */
function DirtyReset({ onSubmitting }: { onSubmitting: () => void }) {
  const { pending } = useFormStatus();
  useEffect(() => {
    if (pending) onSubmitting();
  }, [pending, onSubmitting]);
  return null;
}

interface FormShellProps {
  action: AdminAction;
  children: (errors: Record<string, string>) => ReactNode;
  submitLabel?: string;
  busyLabel?: string;
  deletable?: boolean;
  confirmText?: string;
  /** Clear the form after a successful submit — used by the "add new" forms. */
  resetOnSuccess?: boolean;
  hidden?: Record<string, string>;
}

/**
 * One form, one Server Action, inline feedback.
 *
 * The save bar only appears once something has actually changed, and the
 * browser warns before you navigate away with unsaved edits — the admin is a
 * lot of long text fields, and losing one to a stray click is miserable.
 *
 * Still works without client JS: it is a plain form posting to a Server Action.
 * The hooks only add the pending state, the dirty tracking and the confirm.
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
  const [dirty, setDirty] = useState(false);

  const clearDirty = useCallback(() => setDirty(false), []);

  // A successful save makes the form clean again. Adjusted during render
  // rather than in an effect: an effect would paint the "unsaved changes" bar
  // for a frame after the save landed.
  const [seenResult, setSeenResult] = useState(result);
  if (seenResult !== result) {
    setSeenResult(result);
    if (result?.ok) setDirty(false);
  }

  // Clearing the fields is a DOM side effect, so it stays in an effect.
  useEffect(() => {
    if (result?.ok && resetOnSuccess) formRef.current?.reset();
  }, [result, resetOnSuccess]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  return (
    <form
      ref={formRef}
      action={formAction}
      onInput={() => setDirty(true)}
      onChange={() => setDirty(true)}
    >
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
          <div>{result.message}</div>
        </div>
      ) : null}

      {children(result?.fields ?? {})}

      <DirtyReset onSubmitting={clearDirty} />

      <div className={dirty ? 'adm-actions adm-actions-dirty' : 'adm-actions'}>
        {dirty ? <span className="adm-dirty-note">Unsaved changes</span> : null}
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
