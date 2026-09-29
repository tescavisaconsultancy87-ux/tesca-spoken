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
    '/.env',
    '/.git',
    '/*.php',
    '/wp-admin/',
    '/wp-content/',
  ];

  const allowedBots = [
    '*',
    'Googlebot',
    'GoogleOther',
    'Google-Extended',
    'Bingbot',
    'OAI-SearchBot',
    'GPTBot',
    'ChatGPT-User',
    'PerplexityBot',
    'ClaudeBot',
    'Claude-Web',
    'anthropic-ai',
    'Applebot',
    'Applebot-Extended',
    'Meta-ExternalAgent',
    'Meta-ExternalFetcher',
    'CCBot',
    'DuckDuckBot',
    'YandexBot',
    'Baiduspider',
    'Bytespider',
    'PetalBot',
  ];

  return {
    rules: allowedBots.map((bot) => ({
      userAgent: bot,
      allow: '/',
      disallow: disallowedPaths,
    })),
    sitemap: 'https://tesca.co/sitemap.xml',
  };
}
