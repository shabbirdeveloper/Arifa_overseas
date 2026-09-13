import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

const ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}> = [
  { path: '/', priority: 1, changeFrequency: 'monthly' },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/manpower', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/projects', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/careers', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/certificates', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/gallery', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.9, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
