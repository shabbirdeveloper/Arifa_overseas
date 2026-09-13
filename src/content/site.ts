import type { NavItem } from './types';

/** Single source of truth for company identity, contact details and navigation. */
export const site = {
  name: 'Arifa Overseas',
  legalName: 'Arifa Overseas Sdn Bhd',
  registrationNumber: '201701040990 (1255163-T)',
  cidbNumber: '0120210729-JH079229',
  tagline: 'Construction & Manpower Supply',
  description:
    'Arifa Overseas Sdn Bhd delivers construction, skilled manpower supply and facility maintenance across Malaysia. CIDB G7 registered, ISO 9001:2015 certified, based in Pasir Gudang, Johor.',
  founded: '2017',

  phone: {
    display: '+60 14-646 4067',
    href: 'tel:+60146464067',
    e164: '+60146464067',
  },
  email: 'arifaoverseas786@gmail.com',
  whatsapp: 'https://wa.me/60146464067',
  mapsLink: 'https://share.google/NujwC6UnItP4iozkk',
  mapsEmbed:
    'https://maps.google.com/maps?q=Arifa+Overseas,+Johor+Bahru,+Malaysia&output=embed&z=15&hl=en',

  /** What visitors see on the contact card — the wider area we're known for. */
  displayLocation: 'Johor Bahru, Malaysia',

  address: {
    line1: '3, 1 Business Centre 2, No 32-A',
    line2: 'Jalan Mawar Merah, Kawasan Perindustrian Pasir Gudang',
    postalCode: '81700',
    city: 'Pasir Gudang',
    region: 'Johor Darul Ta’zim',
    country: 'Malaysia',
    countryCode: 'MY',
    /** Approximate — refine from Google Maps if you want exact pin coordinates. */
    latitude: 1.4703,
    longitude: 103.8967,
  },

  openingHours: {
    display: 'Mon – Sat, 8:00am – 6:00pm',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '08:00',
    closes: '18:00',
  },

  stats: {
    years: 10,
    projects: 50,
    workers: 1000,
    satisfaction: 100,
  },
} as const;

export const navItems: NavItem[] = [
  { href: '/', label: 'HOME' },
  { href: '/services', label: 'OUR SERVICES' },
  { href: '/manpower', label: 'MANPOWER' },
  { href: '/projects', label: 'OUR PROJECTS' },
  { href: '/careers', label: 'CAREERS' },
  { href: '/certificates', label: 'CERTIFICATES' },
  { href: '/gallery', label: 'GALLERY' },
  { href: '/about', label: 'ABOUT US' },
  { href: '/contact', label: 'CONTACT US' },
];

export const serviceOptions = [
  'Construction',
  'Manpower Supply',
  'Maintenance',
  'All Services',
] as const;

export const experienceOptions = [
  'No experience',
  '1 – 2 years',
  '3 – 5 years',
  '5 – 10 years',
  'More than 10 years',
] as const;

/**
 * Hero and section photography. These are still Unsplash stock images carried
 * over from the original site — swap the URLs here for real Arifa Overseas
 * photos (drop the files in /public/images and use e.g. '/images/hero-1.jpg')
 * and the allow-list in next.config.ts can be removed.
 */
export const heroSlides = [
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&q=85',
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&q=85',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=85',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=85',
];

export const pageHeroImages = {
  services: '',
  manpower: '',
  projects: '',
  about: '',
  contact: '',
  certificates:
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&q=85',
  careers:
    'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1920&q=85',
  gallery:
    'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=1920&q=85',
} as const;

export const sectionImages = {
  aboutPreview:
    'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=900&q=85',
  aboutStory:
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=85',
} as const;
