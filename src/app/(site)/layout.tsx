import { Footer } from '@/components/layout/Footer';
import { Nav } from '@/components/layout/Nav';
import { ScrollReveal } from '@/components/layout/ScrollReveal';
import { Splash } from '@/components/layout/Splash';
import { WhatsAppFab } from '@/components/layout/WhatsAppFab';
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/JsonLd';

/**
 * Chrome for the public website. The admin area sits outside this layout, so
 * it gets none of the marketing nav, splash or structured data.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <noscript>
        {/* Without JS the splash never hides and reveal elements never get
            `.in` — in the legacy site that left a blank page. Undo both. */}
        <style>{`#splash{display:none!important}
.s3d,.s3d-l,.s3d-r,.s3d-p,.s3d-left,.s3d-right,.s3d-pop{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Splash />
      <Nav />
      <WhatsAppFab />
      <main id="main">{children}</main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
