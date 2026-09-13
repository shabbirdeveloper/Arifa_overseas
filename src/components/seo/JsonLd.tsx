import { site } from '@/content/site';
import { certificates } from '@/content/certificates';
import { jobs } from '@/content/jobs';
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
 * Google Jobs experience.
 *
 * `datePosted` and `validThrough` are derived from the build date because the
 * source listings carry no dates — add real dates to src/content/jobs.ts if
 * you want them to be accurate.
 */
export function JobPostingsJsonLd() {
  const datePosted = new Date();
  const validThrough = new Date(datePosted);
  validThrough.setMonth(validThrough.getMonth() + 3);

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
            datePosted: datePosted.toISOString().slice(0, 10),
            validThrough: validThrough.toISOString().slice(0, 10),
            employmentType: job.type.toUpperCase().includes('FULL')
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
            url: absoluteUrl(`/careers#${job.id}`),
          }}
        />
      ))}
    </>
  );
}
