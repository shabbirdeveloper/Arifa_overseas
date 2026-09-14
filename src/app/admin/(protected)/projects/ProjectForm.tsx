'use client';

import type { FeaturedProjectRow } from '@/lib/supabase/types';
import { Field, FormShell, type AdminAction } from '../_components/FormShell';
import { ImageField } from '../_components/ImageField';

const CATEGORIES = ['Construction', 'Manpower', 'Maintenance'] as const;

interface ProjectFormProps {
  action: AdminAction;
  project?: FeaturedProjectRow;
  nextSortOrder?: number;
}

export function ProjectForm({
  action,
  project,
  nextSortOrder = 0,
}: ProjectFormProps) {
  const isNew = !project;

  return (
    <FormShell
      action={action}
      submitLabel={isNew ? 'Add project' : 'Save changes'}
      busyLabel={isNew ? 'Adding…' : 'Saving…'}
      deletable={!isNew}
      confirmText={`Delete ${project?.title ?? 'this project'}? This cannot be undone.`}
      resetOnSuccess={isNew}
      hidden={project ? { id: project.id } : undefined}
    >
      {(errors) => (
        <>
          <div className="adm-grid-2">
            <Field label="Title" name="title" errors={errors}>
              <input
                id="f-title"
                name="title"
                type="text"
                defaultValue={project?.title ?? ''}
                placeholder="Commercial Complex, JB"
                required
                aria-invalid={errors.title ? true : undefined}
              />
            </Field>

            <Field label="Category" name="category" errors={errors}>
              <select
                id="f-category"
                name="category"
                defaultValue={project?.category ?? 'Construction'}
                aria-invalid={errors.category ? true : undefined}
              >
                {CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label="Description"
            name="description"
            errors={errors}
            hint="One or two lines, shown when someone hovers the tile."
            wide
          >
            <textarea
              id="f-description"
              name="description"
              defaultValue={project?.description ?? ''}
              aria-invalid={errors.description ? true : undefined}
            />
          </Field>

          <ImageField
            label="Project photo"
            name="image_url"
            widthName="image_width"
            heightName="image_height"
            folder="projects"
            initialUrl={project?.image_url}
            initialWidth={project?.image_width}
            initialHeight={project?.image_height}
            required
            error={errors.image_url}
          />

          <Field
            label="Image description"
            name="image_alt"
            errors={errors}
            hint="Read aloud by screen readers. Defaults to the title if left blank."
            wide
          >
            <input
              id="f-image_alt"
              name="image_alt"
              type="text"
              defaultValue={project?.image_alt ?? ''}
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
                defaultValue={project?.sort_order ?? nextSortOrder}
              />
            </Field>

            <div className="adm-field" style={{ justifyContent: 'flex-end' }}>
              <label className="adm-check">
                <input
                  type="checkbox"
                  name="is_tall"
                  defaultChecked={project?.is_tall ?? false}
                />
                Double-height tile
              </label>
            </div>

            <div className="adm-field" style={{ justifyContent: 'flex-end' }}>
              <label className="adm-check">
                <input
                  type="checkbox"
                  name="is_published"
                  defaultChecked={project?.is_published ?? true}
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
