'use client';

import { JOB_ICON_KEYS, JOB_ICON_LABELS } from '@/content/job-icons';
import type { JobRow } from '@/lib/supabase/types';
import { Field, FormShell, type AdminAction } from '../_components/FormShell';

const CATEGORIES = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'skilled', label: 'Skilled Trades' },
  { value: 'general', label: 'General' },
  { value: 'management', label: 'Management' },
] as const;

interface JobFormProps {
  action: AdminAction;
  job?: JobRow;
  nextSortOrder?: number;
}

function threeMonthsOut(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 3);
  return date.toISOString().slice(0, 10);
}

export function JobForm({ action, job, nextSortOrder = 0 }: JobFormProps) {
  const isNew = !job;

  return (
    <FormShell
      action={action}
      submitLabel={isNew ? 'Add job' : 'Save changes'}
      busyLabel={isNew ? 'Adding…' : 'Saving…'}
      deletable={!isNew}
      confirmText={`Delete ${job?.title ?? 'this job'}? This cannot be undone.`}
      resetOnSuccess={isNew}
      hidden={job ? { id: job.id } : undefined}
    >
      {(errors) => (
        <>
          <div className="adm-grid-2">
            <Field label="Job title" name="title" errors={errors}>
              <input
                id="f-title"
                name="title"
                type="text"
                defaultValue={job?.title ?? ''}
                placeholder="Civil Engineer"
                required
                aria-invalid={errors.title ? true : undefined}
              />
            </Field>

            <Field
              label="Web address"
              name="slug"
              errors={errors}
              hint="Leave blank to generate it from the title."
            >
              <input
                id="f-slug"
                name="slug"
                type="text"
                defaultValue={job?.slug ?? ''}
                placeholder="civil-engineer"
                aria-invalid={errors.slug ? true : undefined}
              />
            </Field>
          </div>

          <div className="adm-grid">
            <Field label="Department" name="category" errors={errors}>
              <select
                id="f-category"
                name="category"
                defaultValue={job?.category ?? 'engineering'}
                aria-invalid={errors.category ? true : undefined}
              >
                {CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Badge text"
              name="category_label"
              errors={errors}
              hint="Shown on the card. Defaults to the department."
            >
              <input
                id="f-category_label"
                name="category_label"
                type="text"
                defaultValue={job?.category_label ?? ''}
                placeholder="Engineering"
              />
            </Field>

            <Field label="Icon" name="icon_key" errors={errors}>
              <select
                id="f-icon_key"
                name="icon_key"
                defaultValue={job?.icon_key ?? 'briefcase'}
                aria-invalid={errors.icon_key ? true : undefined}
              >
                {JOB_ICON_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {JOB_ICON_LABELS[key]}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="adm-grid">
            <Field label="Location" name="location" errors={errors}>
              <input
                id="f-location"
                name="location"
                type="text"
                defaultValue={job?.location ?? 'Johor Bahru, Malaysia'}
              />
            </Field>

            <Field label="Employment type" name="employment_type" errors={errors}>
              <input
                id="f-employment_type"
                name="employment_type"
                type="text"
                defaultValue={job?.employment_type ?? 'Full Time'}
                placeholder="Full Time"
              />
            </Field>

            <Field label="Salary range" name="salary" errors={errors}>
              <input
                id="f-salary"
                name="salary"
                type="text"
                defaultValue={job?.salary ?? ''}
                placeholder="RM 3,500 – 6,000/mo"
              />
            </Field>
          </div>

          <Field
            label="Requirements"
            name="requirements"
            errors={errors}
            hint="One per line. Each becomes a ticked bullet on the card."
            wide
          >
            <textarea
              id="f-requirements"
              name="requirements"
              rows={5}
              defaultValue={(job?.requirements ?? []).join('\n')}
              placeholder={'Degree in Civil Engineering or equivalent\nMinimum 2 years site experience'}
            />
          </Field>

          <div className="adm-grid">
            <Field
              label="Posted on"
              name="posted_at"
              errors={errors}
              hint="Used by Google Jobs."
            >
              <input
                id="f-posted_at"
                name="posted_at"
                type="date"
                defaultValue={job?.posted_at ?? new Date().toISOString().slice(0, 10)}
                aria-invalid={errors.posted_at ? true : undefined}
              />
            </Field>

            <Field
              label="Closes on"
              name="valid_through"
              errors={errors}
              hint="Google stops showing the listing after this date."
            >
              <input
                id="f-valid_through"
                name="valid_through"
                type="date"
                defaultValue={job?.valid_through ?? threeMonthsOut()}
                aria-invalid={errors.valid_through ? true : undefined}
              />
            </Field>

            <div className="adm-field" style={{ justifyContent: 'flex-end' }}>
              <label className="adm-check">
                <input
                  type="checkbox"
                  name="is_published"
                  defaultChecked={job?.is_published ?? true}
                />
                Show on the website
              </label>
            </div>
          </div>

          <input
            type="hidden"
            name="sort_order"
            value={job?.sort_order ?? nextSortOrder}
          />
        </>
      )}
    </FormShell>
  );
}
