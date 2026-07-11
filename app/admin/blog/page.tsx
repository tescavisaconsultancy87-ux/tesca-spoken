'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, FileText, Eye, EyeOff, X, Calendar, User } from 'lucide-react';
import { db } from '@/lib/db';
import RichTextEditor from '@/components/RichTextEditor';
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogClose,
} from '@/components/animate-ui/primitives/base/alert-dialog';

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

export default function AdminBlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  const loadPosts = async () => {
    try {
      const data = await db.getBlogPosts();
      setPosts(data);
    } catch (err) {
      console.error('Failed to load blog posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    image_url: '',
    published: false,
  });

  const [imageError, setImageError] = useState<string | null>(null);

  const resetForm = () => {
    setForm({ title: '', slug: '', excerpt: '', content: '', author: '', image_url: '', published: false });
    setEditingPost(null);
    setImageError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);
    if (!file) return;

    // Check size <= 500KB
    if (file.size > 500 * 1024) {
      setImageError('Image size must be less than 500 KB.');
      e.target.value = '';
      return;
    }

    // Check type is JPG or PNG
    const isJpg = file.type === 'image/jpeg' || file.type === 'image/jpg';
    const isPng = file.type === 'image/png';

    if (!isJpg && !isPng) {
      setImageError('Only JPG, JPEG, and PNG images are allowed.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        image_url: reader.result as string,
      }));
    };
    reader.onerror = () => {
      setImageError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const openAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const openEdit = (post: BlogPost) => {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      image_url: post.image_url || '',
      published: post.published,
    });
    setEditingPost(post);
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      excerpt: form.excerpt,
      content: form.content,
      author: form.author,
      image_url: form.image_url,
      published: form.published,
    };

    if (editingPost) {
      await db.updateBlogPost(editingPost.id, payload);
    } else {
      await db.createBlogPost(payload);
    }

    resetForm();
    setIsAdding(false);
    loadPosts();
  };

  const handleDelete = async () => {
    if (deletePostId) {
      await db.deleteBlogPost(deletePostId);
      setDeletePostId(null);
      loadPosts();
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    await db.updateBlogPost(id, { published: !current });
    loadPosts();
  };

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Blog Manager</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Create, edit, and publish blog posts</p>
        </div>
        {!isAdding && (
          <button
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-primary hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition-all shadow-soft self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            New Post
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-4xl shadow-soft animate-scale-up">
          <div className="flex justify-between items-center pb-4 border-b border-gray-50">
            <h3 className="text-base font-bold text-gray-800">
              {editingPost ? 'Edit Post' : 'New Blog Post'}
            </h3>
            <button onClick={() => { setIsAdding(false); resetForm(); }} className="p-1 rounded-lg text-gray-400 hover:bg-gray-50">
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-bold text-gray-500">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. 5 Tips to Improve Spoken English"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-bold text-gray-500">Slug (auto-generated if empty)</label>
                <input
                  type="text"
                  placeholder="e.g. 5-tips-improve-spoken-english"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-bold text-gray-500">Author *</label>
                <input
                  type="text"
                  placeholder="e.g. TESCA Team"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-bold text-gray-500">Featured Image (Max 500 KB, JPG/PNG)</label>
                <div className="flex items-center gap-3">
                  {form.image_url ? (
                    <div className="relative h-[38px] w-20 rounded-xl overflow-hidden border border-gray-200 group">
                      <img src={form.image_url} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image_url: '' })}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="blog-image-upload"
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100/50 cursor-pointer"
                    >
                      <Plus className="h-4 w-4 text-gray-400" />
                      Choose Image
                    </label>
                  )}
                  <input
                    type="file"
                    id="blog-image-upload"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                {imageError && (
                  <p className="text-[10px] text-rose-500 font-semibold mt-1">{imageError}</p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Excerpt / Summary *</label>
              <textarea
                placeholder="Brief description for the blog listing..."
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none h-20 resize-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#4F6C8D] uppercase tracking-wider">Article Content *</label>
              <RichTextEditor
                value={form.content}
                onChange={(val) => setForm({ ...form, content: val })}
                placeholder="Write your blog post content here... Highlight text to apply bold, italic, headings, or lists."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="published" className="text-xs font-bold text-gray-600">
                Publish immediately
              </label>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-50">
              <button
                type="button"
                onClick={() => { setIsAdding(false); resetForm(); }}
                className="px-4 py-2.5 rounded-xl border border-gray-150 text-gray-500 text-xs font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-600 shadow-soft"
              >
                {editingPost ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 w-full md:w-[280px] shadow-soft">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">No blog posts yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((post) => (
                <div
                  key={post.id}
                  className={`bg-white border rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all duration-300 ${
                    !post.published ? 'opacity-60 bg-gray-50/55' : 'border-gray-100/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-800 truncate">{post.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 mt-2.5 text-[10px] text-gray-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          post.published
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openEdit(post)}
                        className="p-1.5 rounded-lg border border-gray-100 hover:border-primary-100 text-primary hover:bg-primary-50"
                        title="Edit"
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleTogglePublish(post.id, post.published)}
                        className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                          post.published
                            ? 'border-gray-100 hover:bg-gray-50 text-gray-500'
                            : 'border-emerald-100 hover:bg-emerald-50 text-emerald-600'
                        }`}
                        title={post.published ? 'Unpublish' : 'Publish'}
                      >
                        {post.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => setDeletePostId(post.id)}
                        className="p-1.5 rounded-lg border border-gray-100 hover:border-rose-100 text-rose-600 hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <AlertDialog open={deletePostId !== null} onOpenChange={(open) => { if (!open) setDeletePostId(null); }}>
        <AlertDialogPortal>
          <AlertDialogBackdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <AlertDialogPopup from="bottom" className="sm:max-w-md border bg-white rounded-3xl p-6 shadow-2xl">
            <AlertDialogHeader>
              <div className="mx-auto h-12 w-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4 border border-rose-100 shadow-soft">
                <Trash2 className="h-6 w-6" />
              </div>
              <AlertDialogTitle className="text-lg font-bold text-center text-gray-800">
                Delete Post?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-center text-gray-500 mt-2">
                Are you sure you want to delete this blog post? This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 flex justify-end gap-3 w-full">
              <AlertDialogClose className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer border border-gray-200">
                Cancel
              </AlertDialogClose>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-soft"
              >
                Delete Post
              </button>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>
    </div>
  );
}
