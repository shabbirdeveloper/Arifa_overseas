'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Lightbox } from '@/components/ui/Lightbox';
import { certificates, type CertificateWithSize } from '@/content/certificates';

export function CertificateCards() {
  const [active, setActive] = useState<CertificateWithSize | null>(null);

  return (
    <>
      <div className="cert-cards-grid">
        {certificates.map((certificate, index) => (
          <div
            key={certificate.id}
            id={certificate.id}
            className={`cert-full-card s3d d${(index % 3) + 1}`}
          >
            <div className="cert-full-icon">
              <Icon svg={certificate.icon} />
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
