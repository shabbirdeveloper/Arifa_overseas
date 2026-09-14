'use client';

import type { HistoryGroupRow, HistoryItemRow } from '@/lib/supabase/types';
import { Field, FormShell, type AdminAction } from '../_components/FormShell';

const STYLES = [
  { value: 'default', label: 'Plain' },
  { value: 'ongoing', label: 'Ongoing (pulsing)' },
  { value: 'primary', label: 'Solid blue' },
  { value: 'muted', label: 'Soft blue' },
] as const;

// ── group ───────────────────────────────────────────────────────────────────

export function GroupForm({
  action,
  group,
  nextSortOrder = 0,
}: {
  action: AdminAction;
  group?: HistoryGroupRow;
  nextSortOrder?: number;
}) {
  const isNew = !group;

  return (
    <FormShell
      action={action}
      submitLabel={isNew ? 'Add group' : 'Save group'}
      busyLabel="Saving…"
      deletable={!isNew}
      confirmText={`Delete "${group?.title ?? ''}" and every record inside it? This cannot be undone.`}
      resetOnSuccess={isNew}
      hidden={group ? { id: group.id } : undefined}
    >
      {(errors) => (
        <div className="adm-grid">
          <Field
            label="Badge"
            name="badge"
            errors={errors}
            hint="The pill on the left, e.g. 2024."
          >
            <input
              id="f-badge"
              name="badge"
              type="text"
              defaultValue={group?.badge ?? ''}
              placeholder="2024"
              required
              aria-invalid={errors.badge ? true : undefined}
            />
          </Field>

          <Field label="Heading" name="title" errors={errors}>
            <input
              id="f-title"
              name="title"
              type="text"
              defaultValue={group?.title ?? ''}
              placeholder="Latest Project"
              required
              aria-invalid={errors.title ? true : undefined}
            />
          </Field>

          <Field label="Badge style" name="style" errors={errors}>
            <select
              id="f-style"
              name="style"
              defaultValue={group?.style ?? 'default'}
              aria-invalid={errors.style ? true : undefined}
            >
              {STYLES.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </Field>

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
              defaultValue={group?.sort_order ?? nextSortOrder}
            />
          </Field>
        </div>
      )}
    </FormShell>
  );
}

// ── item ────────────────────────────────────────────────────────────────────

export function ItemForm({
  action,
  groups,
  item,
  defaultGroupId,
  nextSortOrder = 0,
}: {
  action: AdminAction;
  groups: HistoryGroupRow[];
  item?: HistoryItemRow;
  defaultGroupId?: string;
  nextSortOrder?: number;
}) {
  const isNew = !item;

  return (
    <FormShell
      action={action}
      submitLabel={isNew ? 'Add record' : 'Save record'}
      busyLabel="Saving…"
      deletable={!isNew}
      confirmText={`Delete the ${item?.client ?? ''} record? This cannot be undone.`}
      resetOnSuccess={isNew}
      hidden={item ? { id: item.id } : undefined}
    >
      {(errors) => (
        <>
          <div className="adm-grid">
            <Field label="Year group" name="group_id" errors={errors}>
              <select
                id="f-group_id"
                name="group_id"
                defaultValue={item?.group_id ?? defaultGroupId ?? ''}
                required
                aria-invalid={errors.group_id ? true : undefined}
              >
                <option value="">Select…</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.badge} — {group.title}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Number"
              name="num"
              errors={errors}
              hint="The small reference shown top-left."
            >
              <input
                id="f-num"
                name="num"
                type="text"
                defaultValue={item?.num ?? ''}
                placeholder="24"
              />
            </Field>

            <Field
              label="Value"
              name="value"
              errors={errors}
              hint="e.g. RM 7,000,000 — or leave blank."
            >
              <input
                id="f-value"
                name="value"
                type="text"
                defaultValue={item?.value ?? ''}
                placeholder="RM 7,000,000"
              />
            </Field>
          </div>

          <div className="adm-grid-2">
            <Field label="Client" name="client" errors={errors}>
              <input
                id="f-client"
                name="client"
                type="text"
                defaultValue={item?.client ?? ''}
                placeholder="Seremban Engineering SDN BHD"
                required
                aria-invalid={errors.client ? true : undefined}
              />
            </Field>

            <Field label="Work carried out" name="title" errors={errors}>
              <input
                id="f-title"
                name="title"
                type="text"
                defaultValue={item?.title ?? ''}
                placeholder="Intel Falcon Project (Kulim)"
                required
                aria-invalid={errors.title ? true : undefined}
              />
            </Field>
          </div>

          <Field label="Scope" name="scope" errors={errors} wide>
            <textarea
              id="f-scope"
              name="scope"
              defaultValue={item?.scope ?? ''}
              placeholder="Piping installation with full equipment supply…"
            />
          </Field>

          <Field
            label="Tags"
            name="tags"
            errors={errors}
            hint="Comma separated, e.g. Piping, Equipment, Intel"
            wide
          >
            <input
              id="f-tags"
              name="tags"
              type="text"
              defaultValue={(item?.tags ?? []).join(', ')}
            />
          </Field>

          <div className="adm-grid" style={{ marginTop: 14 }}>
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
                defaultValue={item?.sort_order ?? nextSortOrder}
              />
            </Field>

            <Field
              label="Flagship badge"
              name="mega_badge"
              errors={errors}
              hint="Only shown when Flagship is ticked."
            >
              <input
                id="f-mega_badge"
                name="mega_badge"
                type="text"
                defaultValue={item?.mega_badge ?? ''}
                placeholder="🏆 Flagship Project"
              />
            </Field>
          </div>

          <div className="adm-grid" style={{ marginTop: 10 }}>
            <label className="adm-check">
              <input
                type="checkbox"
                name="is_ongoing"
                defaultChecked={item?.is_ongoing ?? false}
              />
              Ongoing (green dot)
            </label>
            <label className="adm-check">
              <input
                type="checkbox"
                name="is_highlight"
                defaultChecked={item?.is_highlight ?? false}
              />
              Highlight (gold border)
            </label>
            <label className="adm-check">
              <input
                type="checkbox"
                name="is_mega"
                defaultChecked={item?.is_mega ?? false}
              />
              Flagship (large card)
            </label>
            <label className="adm-check">
              <input
                type="checkbox"
                name="is_published"
                defaultChecked={item?.is_published ?? true}
              />
              Show on the website
            </label>
          </div>
        </>
      )}
    </FormShell>
  );
}
