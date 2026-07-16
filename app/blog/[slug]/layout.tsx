import type { Metadata } from 'next';
import { db } from '@/lib/db';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const posts = await db.getBlogPosts();
    const post = (posts || []).find((p: any) => p.slug === slug && p.published);

    if (post) {
      return {
        title: `${post.title} — TESCA Spoken English Blog`,
        description: post.excerpt?.substring(0, 160) || 'Read this article from the TESCA Spoken English blog.',
        alternates: {
          canonical: `https://tesca.co/blog/${slug}`,
        },
        openGraph: {
          title: post.title,
          description: post.excerpt?.substring(0, 160) || 'Read this article from the TESCA Spoken English blog.',
          url: `https://tesca.co/blog/${slug}`,
          type: 'article',
          publishedTime: post.created_at,
          authors: [post.author || 'TESCA Spoken English'],
          images: post.image_url ? [{ url: post.image_url, width: 1200, height: 630 }] : [{ url: '/og-image.jpg', width: 1200, height: 630 }],
        },
        twitter: {
          card: 'summary_large_image',
          title: post.title,
          description: post.excerpt?.substring(0, 160) || 'Read this article from the TESCA Spoken English blog.',
          images: post.image_url ? [post.image_url] : ['/og-image.jpg'],
        },
      };
    }
  } catch (err) {
    console.error('Failed to load blog post metadata:', err);
  }

  return {
    title: 'Blog Post — TESCA Spoken English',
    description: 'Read expert articles on spoken English and exam preparation.',
    alternates: {
      canonical: `https://tesca.co/blog/${slug}`,
    },
  };
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
