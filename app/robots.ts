import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/student/',
        '/tutor/',
        '/api/',
        '/login',
        '/forgot-password',
        '/reset-password',
        '/change-password',
      ],
    },
    sitemap: 'https://tesca.co/sitemap.xml',
  };
}
