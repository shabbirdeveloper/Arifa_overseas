import Link from 'next/link';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="page active">
      <div className="ph">
        <div className="ph-bg" />
        <div className="ph-ov" />
        <div className="ph-dots" />
        <div className="ph-content inner" style={{ paddingTop: 60 }}>
          <div className="tag">404</div>
          <h1
            style={{
              fontSize: 'clamp(2.4rem,5vw,4.2rem)',
              fontWeight: 300,
              letterSpacing: '-1px',
              lineHeight: 1.1,
            }}
          >
            Page <em style={{ color: 'var(--blue)', fontStyle: 'normal' }}>Not Found</em>
          </h1>
          <p
            style={{
              fontSize: '1rem',
              fontWeight: 300,
              color: 'var(--light)',
              maxWidth: 520,
              lineHeight: 1.7,
              marginTop: 16,
            }}
          >
            The page you are looking for has moved or no longer exists.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 28, flexWrap: 'wrap' }}>
            <Link href="/" className="btn-p">
              Back to Home
            </Link>
            <Link href="/contact" className="btn-o">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
