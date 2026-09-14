import { site } from '@/content/site';
import { certificates } from '@/content/certificates';
import type { Job } from '@/lib/data/jobs';
import { absoluteUrl } from '@/lib/seo';

/** Serialises structured data, escaping `<` so the JSON can't break out. */
function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: `${site.address.line1}, ${site.address.line2}`,
  addressLocality: site.address.city,
  addressRegion: site.address.region,
  postalCode: site.address.postalCode,
  addressCountry: site.address.countryCode,
};

/** Organization + LocalBusiness, rendered once in the root layout. */
export function OrganizationJsonLd() {
  return (
    <JsonLdScript
      data={{
        '@context': 'https://schema.org',
        '@type': ['Organization', 'GeneralContractor'],
        '@id': absoluteUrl('/#organization'),
        name: site.legalName,
        alternateName: site.name,
        url: absoluteUrl('/'),
        logo: absoluteUrl('/logo.png'),
        image: absoluteUrl('/logo.png'),
        description: site.description,
        foundingDate: site.founded,
        telephone: site.phone.e164,
        email: site.email,
        address: postalAddress,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: site.address.latitude,
          longitude: site.address.longitude,
        },
        areaServed: { '@type': 'Country', name: 'Malaysia' },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: site.openingHours.days,
            opens: site.openingHours.opens,
            closes: site.openingHours.closes,
          },
        ],
        hasCredential: certificates.map((certificate) => ({
          '@type': 'EducationalOccupationalCredential',
          name: certificate.name,
          recognizedBy: { '@type': 'Organization', name: certificate.authority },
        })),
        sameAs: [site.whatsapp],
      }}
    />
  );
}

/** WebSite entity — lets Google show the site name in results. */
export function WebSiteJsonLd() {
  return (
    <JsonLdScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': absoluteUrl('/#website'),
        url: absoluteUrl('/'),
        name: site.name,
        publisher: { '@id': absoluteUrl('/#organization') },
        inLanguage: 'en-MY',
      }}
    />
  );
}

/**
 * JobPosting for every open role, so the careers page is eligible for the
 * Google Jobs experience. Dates come from the database so a listing drops out
 * of Google when it actually closes.
 */
export function JobPostingsJsonLd({ jobs }: { jobs: Job[] }) {
  return (
    <>
      {jobs.map((job) => (
        <JsonLdScript
          key={job.id}
          data={{
            '@context': 'https://schema.org',
            '@type': 'JobPosting',
            title: job.title,
            description: `${job.title} at ${site.legalName}. Requirements: ${job.requirements.join('; ')}.`,
            datePosted: job.postedAt,
            validThrough: job.validThrough,
            employmentType: job.employmentType.toUpperCase().includes('FULL')
              ? 'FULL_TIME'
              : 'CONTRACTOR',
            hiringOrganization: {
              '@type': 'Organization',
              name: site.legalName,
              sameAs: absoluteUrl('/'),
              logo: absoluteUrl('/logo.png'),
            },
            jobLocation: {
              '@type': 'Place',
              address: postalAddress,
            },
            directApply: true,
            url: absoluteUrl(`/careers#${job.slug}`),
          }}
        />
      ))}
    </>
  );
}
