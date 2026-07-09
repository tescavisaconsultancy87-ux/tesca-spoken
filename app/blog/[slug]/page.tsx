'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { db } from '@/lib/db';
import { Calendar, User, ArrowLeft } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  image_url: string;
  published: boolean;
  created_at: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await db.getBlogPosts();
        const found = (data || []).find(
          (p: BlogPost) => p.slug === params.slug && p.published
        );
        setPost(found || null);
      } catch (err) {
        console.error('Failed to load blog post', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.slug]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        {loading ? (
          <div className="pt-40 pb-20 text-center text-ink-muted">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-2 text-xs font-semibold">Loading post...</p>
          </div>
        ) : !post ? (
          <section className="pt-40 pb-20 lg:pt-48 lg:pb-28">
            <div className="container-x text-center space-y-6">
              <h1 className="font-heading text-3xl font-bold text-ink">Post Not Found</h1>
              <p className="text-ink-muted">The blog post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
              <Link href="/blog" className="btn-warm inline-flex">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </div>
          </section>
        ) : (
          <article>
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-40 pb-16 lg:pt-48 lg:pb-20">
              <div className="container-x relative z-10 max-w-3xl mx-auto">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-600 transition-colors mb-8"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Blog
                </Link>

                <div className="space-y-4">
                  <h1 className="font-heading text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
                    {post.title}
                  </h1>

                  <div className="flex items-center gap-4 text-sm text-ink-muted font-medium">
                    <span className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Image */}
            {post.image_url && (
              <div className="container-x max-w-4xl mx-auto -mt-8 relative z-20">
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-black/5 shadow-soft-lg">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <section className="py-16 lg:py-20">
              <div className="container-x max-w-3xl mx-auto">
                {/<[a-z][\s\S]*>/i.test(post.content) ? (
                  <div 
                    className="prose prose-sm sm:prose-base max-w-none prose-headings:font-heading prose-headings:text-ink prose-p:text-ink-muted prose-a:text-primary prose-strong:text-ink prose-ul:list-disc prose-ol:list-decimal"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                ) : (
                  <div className="prose prose-sm sm:prose-base max-w-none prose-headings:font-heading prose-headings:text-ink prose-p:text-ink-muted prose-a:text-primary prose-strong:text-ink">
                    {post.content.split('\n').map((line, i) => {
                      if (line.startsWith('## ')) {
                        return <h2 key={i} className="text-xl font-bold text-ink mt-8 mb-4">{line.replace('## ', '')}</h2>;
                      }
                      if (line.startsWith('### ')) {
                        return <h3 key={i} className="text-lg font-bold text-ink mt-6 mb-3">{line.replace('### ', '')}</h3>;
                      }
                      if (line.startsWith('- ')) {
                        return <li key={i} className="text-ink-muted ml-4">{line.replace('- ', '')}</li>;
                      }
                      if (line.trim() === '') {
                        return <br key={i} />;
                      }
                      return <p key={i} className="text-ink-muted leading-relaxed mb-4">{line}</p>;
                    })}
                  </div>
                )}

                <div className="mt-12 pt-8 border-t border-slate-100">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-600 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to all posts
                  </Link>
                </div>
              </div>
            </section>
          </article>
        )}
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
