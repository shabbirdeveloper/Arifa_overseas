'use client';

import type { TeamMemberRow } from '@/lib/supabase/types';
import { Field, FormShell, type AdminAction } from '../_components/FormShell';
import { ImageField } from '../_components/ImageField';

interface TeamFormProps {
  action: AdminAction;
  member?: TeamMemberRow;
  /** Suggested position for a new member. */
  nextSortOrder?: number;
}

export function TeamForm({ action, member, nextSortOrder = 0 }: TeamFormProps) {
  const isNew = !member;

  return (
    <FormShell
      action={action}
      submitLabel={isNew ? 'Add team member' : 'Save changes'}
      busyLabel={isNew ? 'Adding…' : 'Saving…'}
      deletable={!isNew}
      confirmText={`Delete ${member?.name ?? 'this member'}? This cannot be undone.`}
      resetOnSuccess={isNew}
      hidden={member ? { id: member.id } : undefined}
    >
      {(errors) => (
        <>
          <div className="adm-grid-2">
            <Field label="Name" name="name" errors={errors}>
              <input
                id="f-name"
                name="name"
                type="text"
                defaultValue={member?.name ?? ''}
                required
                aria-invalid={errors.name ? true : undefined}
              />
            </Field>

            <Field label="Role" name="role" errors={errors}>
              <input
                id="f-role"
                name="role"
                type="text"
                defaultValue={member?.role ?? ''}
                placeholder="Project Director"
                required
                aria-invalid={errors.role ? true : undefined}
              />
            </Field>
          </div>

          <Field label="Biography" name="bio" errors={errors} wide>
            <textarea
              id="f-bio"
              name="bio"
              defaultValue={member?.bio ?? ''}
              aria-invalid={errors.bio ? true : undefined}
            />
          </Field>

          <Field
            label="Pull quote"
            name="quote"
            errors={errors}
            hint="Shown in the highlighted box under the biography. Include the quotation marks."
            wide
          >
            <textarea
              id="f-quote"
              name="quote"
              defaultValue={member?.quote ?? ''}
              aria-invalid={errors.quote ? true : undefined}
            />
          </Field>

          <ImageField
            label="Photo"
            name="image_url"
            widthName="image_width"
            heightName="image_height"
            folder="team"
            initialUrl={member?.image_url}
            initialWidth={member?.image_width}
            initialHeight={member?.image_height}
            error={errors.image_url}
          />

          <div className="adm-grid-2" style={{ marginTop: 14 }}>
            <Field
              label="Position"
              name="sort_order"
              errors={errors}
              hint="Lower numbers appear first."
            >
              <input
                id="f-sort_order"
                name="sort_order"
                type="number"
                min={0}
                defaultValue={member?.sort_order ?? nextSortOrder}
              />
            </Field>

            <div className="adm-field" style={{ justifyContent: 'flex-end' }}>
              <label className="adm-check">
                <input
                  type="checkbox"
                  name="is_published"
                  defaultChecked={member?.is_published ?? true}
                />
                Show on the website
              </label>
            </div>
          </div>
        </>
      )}
    </FormShell>
  );
}
