'use client';

import {
  CERT_ICON_KEYS,
  CERT_ICON_LABELS,
} from '@/content/certificate-icons';
import type { CertificateRow } from '@/lib/supabase/types';
import { Field, FormShell, type AdminAction } from '../_components/FormShell';
import { ImageField } from '../_components/ImageField';

interface CertificateFormProps {
  action: AdminAction;
  certificate?: CertificateRow;
  nextSortOrder?: number;
}

export function CertificateForm({
  action,
  certificate,
  nextSortOrder = 0,
}: CertificateFormProps) {
  const isNew = !certificate;

  return (
    <FormShell
      action={action}
      submitLabel={isNew ? 'Add certificate' : 'Save changes'}
      busyLabel={isNew ? 'Adding…' : 'Saving…'}
      deletable={!isNew}
      confirmText={`Delete ${certificate?.name ?? 'this certificate'}? This cannot be undone.`}
      resetOnSuccess={isNew}
      hidden={certificate ? { id: certificate.id } : undefined}
    >
      {(errors) => (
        <>
          <div className="adm-grid">
            <Field label="Certificate name" name="name" errors={errors}>
              <input
                id="f-name"
                name="name"
                type="text"
                defaultValue={certificate?.name ?? ''}
                placeholder="ISO 9001:2015 Certified"
                required
                aria-invalid={errors.name ? true : undefined}
              />
            </Field>

            <Field
              label="Badge"
              name="badge"
              errors={errors}
              hint="The small label on the card, e.g. Certified."
            >
              <input
                id="f-badge"
                name="badge"
                type="text"
                defaultValue={certificate?.badge ?? ''}
                placeholder="Certified"
              />
            </Field>

            <Field label="Icon" name="icon_key" errors={errors}>
              <select
                id="f-icon_key"
                name="icon_key"
                defaultValue={certificate?.icon_key ?? 'registry'}
                aria-invalid={errors.icon_key ? true : undefined}
              >
                {CERT_ICON_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {CERT_ICON_LABELS[key]}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label="Issuing authority"
            name="authority"
            errors={errors}
            hint="Shown as the caption when the certificate is opened full size."
            wide
          >
            <input
              id="f-authority"
              name="authority"
              type="text"
              defaultValue={certificate?.authority ?? ''}
              placeholder="Construction Industry Development Board"
            />
          </Field>

          <Field
            label="Description"
            name="description"
            errors={errors}
            hint="Registration number, validity dates — whatever should sit under the name."
            wide
          >
            <textarea
              id="f-description"
              name="description"
              defaultValue={certificate?.description ?? ''}
              placeholder="Cert No: 24052S016001. Valid: 25 May 2024 – 24 May 2027."
            />
          </Field>

          <ImageField
            label="Certificate scan"
            name="image_url"
            widthName="image_width"
            heightName="image_height"
            folder="certificates"
            initialUrl={certificate?.image_url}
            initialWidth={certificate?.image_width}
            initialHeight={certificate?.image_height}
            error={errors.image_url}
          />

          <input
            type="hidden"
            name="sort_order"
            value={certificate?.sort_order ?? nextSortOrder}
          />

          <label className="adm-check">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={certificate?.is_published ?? true}
            />
            Show on the website
          </label>
        </>
      )}
    </FormShell>
  );
}
