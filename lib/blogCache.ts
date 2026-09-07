// Stale-While-Revalidate (SWR) cache helper for Blog posts
export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category?: string;
  image_url: string;
  published: boolean;
  created_at: string;
  author_id?: string;
}

const STORAGE_CACHE_KEY = 'tesca_blog_posts_cache';
const STORAGE_TIME_KEY = 'tesca_blog_posts_cache_time';
const DEFAULT_FRESH_MS = 30 * 1000; // 30 seconds fresh window before background revalidation

// In-memory module-level cache
let inMemoryPosts: BlogPostItem[] | null = null;
let lastFetchTimestamp = 0;

/**
 * Returns cached blog posts synchronously if available (from in-memory or sessionStorage).
 */
export function getCachedBlogPosts(): BlogPostItem[] | null {
  if (inMemoryPosts && inMemoryPosts.length > 0) {
    return inMemoryPosts;
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem(STORAGE_CACHE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          inMemoryPosts = parsed;
          const timeStr = sessionStorage.getItem(STORAGE_TIME_KEY);
          if (timeStr) {
            lastFetchTimestamp = parseInt(timeStr, 10) || 0;
          }
          return parsed;
        }
      }
    } catch (err) {
      console.warn('[BlogCache] Failed to read cached posts from sessionStorage:', err);
    }
  }

  return null;
}

/**
 * Saves blog posts to in-memory cache and sessionStorage.
 */
export function setCachedBlogPosts(posts: BlogPostItem[]): void {
  if (!Array.isArray(posts)) return;

  inMemoryPosts = posts;
  lastFetchTimestamp = Date.now();

  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(posts));
      sessionStorage.setItem(STORAGE_TIME_KEY, String(lastFetchTimestamp));
    } catch (err) {
      console.warn('[BlogCache] Failed to write posts to sessionStorage:', err);
    }
  }
}

/**
 * Returns a specific blog post by slug from cache if present.
 */
export function getCachedBlogPostBySlug(slug: string): BlogPostItem | null {
  if (!slug) return null;
  const posts = getCachedBlogPosts();
  if (posts && posts.length > 0) {
    const found = posts.find((p) => p.slug === slug);
    if (found) return found;
  }
  return null;
}

/**
 * Checks whether the cache is considered fresh (within threshold).
 */
export function isBlogCacheFresh(freshWindowMs = DEFAULT_FRESH_MS): boolean {
  if (!inMemoryPosts || inMemoryPosts.length === 0) return false;
  return Date.now() - lastFetchTimestamp < freshWindowMs;
}

/**
 * Invalidate cache when blogs are added, edited, or deleted in admin/tutor dashboards.
 */
export function invalidateBlogCache(): void {
  inMemoryPosts = null;
  lastFetchTimestamp = 0;

  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem(STORAGE_CACHE_KEY);
      sessionStorage.removeItem(STORAGE_TIME_KEY);
    } catch (_) {}
  }
}
