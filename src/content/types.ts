/**
 * Shapes for everything under src/content.
 *
 * `icon` fields hold inline SVG markup lifted from the original site. They are
 * static, author-controlled strings — never user input — and are rendered with
 * the <Icon> component.
 */

export type IconMarkup = string;

export interface NavItem {
  href: string;
  label: string;
}

export interface ServiceFeature {
  title: string;
  text: string;
}

export interface Service {
  id: string;
  number: string;
  tag: string;
  /** Heading markup, e.g. `Construction <em>Excellence</em>`. */
  headingHtml: string;
  paragraphs: string[];
  sectionStyle: string;
  reverse: boolean;
  image: string;
  imageAlt: string;
  features: ServiceFeature[];
  cta: string;
  ctaTarget: string;
}

export interface ServicePreview {
  title: string;
  text: string;
  image: string;
  icon: IconMarkup;
  target: string;
}

export interface ManpowerCategory {
  number: string;
  tag: string;
  headingHtml: string;
  paragraphs: string[];
  skills: string[];
  image: string;
  imageAlt: string;
  reverse: boolean;
  cta: string;
}

export interface FeaturedProject {
  src: string;
  alt: string;
  category: string;
  title: string;
  text: string;
  tall: boolean;
}

export interface HistoryTag {
  label: string;
  style: string;
  ongoing: boolean;
}

export interface HistoryCard {
  num: string;
  client: string;
  value: string;
  valueStyle: string;
  ongoing: boolean;
  highlight: boolean;
  mega: boolean;
  megaBadge: string;
  title: string;
  scope: string;
  tags: HistoryTag[];
}

export interface HistoryGroup {
  badge: string;
  badgeStyle: string;
  title: string;
  cards: HistoryCard[];
}

export type JobCategory = 'engineering' | 'skilled' | 'general' | 'management';

export interface Job {
  id: string;
  title: string;
  category: JobCategory;
  categoryLabel: string;
  location: string;
  type: string;
  salary: string;
  requirements: string[];
  icon: IconMarkup;
  iconBg: string;
}

export type GalleryCategory = 'construction' | 'manpower' | 'maintenance' | 'site';

export interface GalleryItem {
  src: string;
  alt: string;
  category: GalleryCategory;
  categoryLabel: string;
  title: string;
}

export interface Certificate {
  id: string;
  name: string;
  badge: string;
  description: string;
  /** Issuing authority, shown as the lightbox caption. */
  authority: string;
  image: string | null;
  icon: IconMarkup;
}

export interface CertificationSummary {
  badge: string;
  title: string;
  text: string;
  icon: IconMarkup;
}

export interface NumberedPoint {
  num: string;
  title: string;
  text: string;
}

export interface ValueCard {
  title: string;
  text: string;
  icon: IconMarkup;
}

export interface Client {
  mark: string;
  name: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  quote: string;
  image: string | null;
}

export interface CareerBenefit {
  title: string;
  text: string;
  icon: IconMarkup;
}
