import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tesca.co';
  const currentDate = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/assessment`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const courses = await db.getCourses();
    if (courses && courses.length > 0) {
      const courseRoutes = courses.map((course: any) => ({
        url: `${baseUrl}/courses/${course.id}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
      dynamicRoutes.push(...courseRoutes);
    }
  } catch (err) {
    console.error('Failed to load courses for sitemap generation:', err);
  }

  try {
    const posts = await db.getBlogPosts();
    if (posts && posts.length > 0) {
      const blogRoutes = posts.map((post: any) => ({
        url: `${baseUrl}/blog/${post.slug || post.id}`,
        lastModified: new Date(post.updated_at || post.created_at || currentDate),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
      dynamicRoutes.push(...blogRoutes);
    }
  } catch (err) {
    console.error('Failed to load blog posts for sitemap generation:', err);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
