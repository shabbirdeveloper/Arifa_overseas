import { requireAdmin } from '@/lib/admin/guard';
import type { CertificateRow } from '@/lib/supabase/types';
import { SortableList } from '../_components/SortableList';
import { createCertificate, updateCertificate } from './actions';
import { CertificateForm } from './CertificateForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Certificates' };

export default async function AdminCertificatesPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('sort_order', { ascending: true });

  const certificates = (data ?? []) as CertificateRow[];
  const nextSortOrder =
    certificates.length > 0
      ? Math.max(...certificates.map((certificate) => certificate.sort_order)) + 1
      : 0;

  const missingTable = error?.message?.includes('certificates') ?? false;

  return (
    <>
      <div className="adm-head">
        <h1>Certificates</h1>
        <p className="adm-sub">
          The accreditation cards on the Certificates page, in this order.
          Upload the scan and visitors can open it full size.
        </p>
      </div>

      {error ? (
        <div className="adm-note adm-note-error">
          <div>
            Could not load certificates: {error.message}.
            {missingTable ? (
              <>
                {' '}
                Run <code>supabase/certificates.sql</code> in the Supabase SQL
                editor — it creates the table and imports the seven certificates
                already on the site.
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      <details className="adm-panel adm-new">
        <summary>Add a certificate</summary>
        <CertificateForm
          action={createCertificate}
          nextSortOrder={nextSortOrder}
        />
      </details>

      <SortableList
        table="certificates"
        items={certificates.map((certificate) => ({
          id: certificate.id,
          title: certificate.name,
          subtitle: certificate.authority || certificate.description,
          thumbnail: certificate.image_url || null,
          badges: (
            <>
              {certificate.badge ? (
                <span className="adm-pill">{certificate.badge}</span>
              ) : null}
              <span
                className={`adm-pill ${certificate.is_published ? 'adm-pill-on' : 'adm-pill-off'}`}
              >
                {certificate.is_published ? 'Live' : 'Hidden'}
              </span>
            </>
          ),
          body: (
            <CertificateForm
              action={updateCertificate}
              certificate={certificate}
            />
          ),
        }))}
        empty={
          error ? null : (
            <div className="adm-empty">
              <h3>No certificates yet</h3>
              <p>
                Run <code>supabase/certificates.sql</code> to import the seven
                already on the site, or add one above.
              </p>
            </div>
          )
        }
      />
    </>
  );
}
