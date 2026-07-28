import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const disallowedPaths = [
    '/admin/',
    '/student/',
    '/tutor/',
    '/api/',
    '/login',
    '/forgot-password',
    '/reset-password',
    '/change-password',
    '/maintenance',
    '/bot-labyrinth/',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowedPaths,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: disallowedPaths,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: disallowedPaths,
      },
    ],
    sitemap: 'https://tesca.co/sitemap.xml',
  };
}
