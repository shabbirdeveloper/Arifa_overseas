'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CertIcon } from '@/content/certificate-icons';
import { Lightbox } from '@/components/ui/Lightbox';
import type { CertificateEntry } from '@/lib/data/certificates';

export function CertificateCards({
  certificates,
}: {
  certificates: CertificateEntry[];
}) {
  const [active, setActive] = useState<CertificateEntry | null>(null);

  return (
    <>
      <div className="cert-cards-grid">
        {certificates.map((certificate, index) => (
          <div
            key={certificate.id}
            id={certificate.slug}
            className={`cert-full-card s3d d${(index % 3) + 1}`}
          >
            <div className="cert-full-icon">
              <span className="icon-slot" aria-hidden="true">
                <CertIcon iconKey={certificate.iconKey} />
              </span>
            </div>
            <div className="cert-full-body">
              <div className="cert-full-badge">{certificate.badge}</div>
              <h3>{certificate.name}</h3>
              <p
                style={{
                  fontSize: '0.76rem',
                  color: 'var(--gray)',
                  fontWeight: 300,
                  lineHeight: 1.5,
                  marginBottom: 6,
                }}
              >
                {certificate.description}
              </p>

              {certificate.image ? (
                <div className="cert-img-real">
                  <Image
                    src={certificate.image}
                    alt={certificate.name}
                    width={certificate.width}
                    height={certificate.height}
                    sizes="(max-width: 700px) 92vw, (max-width: 1024px) 45vw, 360px"
                    loading="lazy"
                  />
                  <div className="cert-zoom-hint">
                    🔍 Click to view full certificate
                  </div>
                  <button
                    type="button"
                    className="tile-open as-button"
                    onClick={() => setActive(certificate)}
                    aria-label={`View the ${certificate.name} certificate`}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {active?.image ? (
        <Lightbox
          variant="document"
          src={active.image}
          alt={active.name}
          caption={active.authority || active.name}
          width={active.width}
          height={active.height}
          onClose={() => setActive(null)}
        />
      ) : null}
    </>
  );
}
