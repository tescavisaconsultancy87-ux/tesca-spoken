'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, FileText, Eye, EyeOff, X, Calendar, User } from 'lucide-react';
import { db } from '@/lib/db';
import RichTextEditor from '@/components/RichTextEditor';
import { useAuth } from '@/context/AuthContext';
import toast from '@/lib/toast';
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
  category?: string;
  image_url: string;
  published: boolean;
  created_at: string;
  author_id?: string;
}

const CATEGORIES = ['Spoken English', 'IELTS', 'PTE'] as const;

export default function BlogManager() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

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

  const toggleSelectPost = (id: string) => {
    setSelectedPostIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const canManage = (post: BlogPost) => {
    return user?.role === 'admin' || post.author_id === user?.id;
  };

  const toggleSelectAll = () => {
    const manageableIds = filtered.filter(canManage).map((p) => p.id);
    const allSelected = manageableIds.length > 0 && manageableIds.every((id) => selectedPostIds.includes(id));
    if (allSelected) {
      setSelectedPostIds([]);
    } else {
      setSelectedPostIds(manageableIds);
    }
  };

  const handleBulkCategoryChange = async (targetCategory: string) => {
    if (selectedPostIds.length === 0) return;
    setIsBulkUpdating(true);
    try {
      const success = await db.bulkUpdateBlogCategory(selectedPostIds, targetCategory);
      if (success) {
        toast.success(
          `Successfully updated ${selectedPostIds.length} blog post(s) to "${targetCategory}"`,
          'Bulk Category Update'
        );
        setSelectedPostIds([]);
        loadPosts();
      } else {
        toast.error('Failed to update blog posts category.', 'Bulk Update Error');
      }
    } catch (err: any) {
      toast.error(err.message || 'Bulk edit failed.', 'Error');
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Spoken English',
    image_url: '',
    published: false,
  });

  const [imageError, setImageError] = useState<string | null>(null);

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: user?.name || '',
      category: 'Spoken English',
      image_url: '',
      published: false,
    });
    setEditingPost(null);
    setImageError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);
    if (!file) return;

    // Check size <= 500KB
    if (file.size > 500 * 1024) {
      const msg = 'Image size must be less than 500 KB.';
      setImageError(msg);
      toast.error(msg, 'Image Validation');
      e.target.value = '';
      return;
    }

    // Check type is JPG or PNG
    const isJpg = file.type === 'image/jpeg' || file.type === 'image/jpg';
    const isPng = file.type === 'image/png';

    if (!isJpg && !isPng) {
      const msg = 'Only JPG, JPEG, and PNG images are allowed.';
      setImageError(msg);
      toast.error(msg, 'Image Validation');
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
      toast.error('Failed to read image file.', 'Image Error');
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
      category: post.category || 'Spoken English',
      image_url: post.image_url || '',
      published: post.published,
    });
    setEditingPost(post);
    setIsAdding(true);
  };

  const getTextLength = (html: string) => {
    if (!html) return 0;
    const plainText = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
    return plainText.length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setImageError(null);

    // 1. Title validation
    if (!form.title.trim() || form.title.trim().length < 5) {
      toast.error('Blog title must be at least 5 characters long.', 'Validation Error');
      return;
    }

    // 2. Featured Image validation (MANDATORY)
    if (!form.image_url || !form.image_url.trim()) {
      const msg = 'Featured image is mandatory for all blog posts. Please upload an image.';
      setImageError(msg);
      toast.error(msg, 'Image Required');
      return;
    }

    // 3. Excerpt / Summary validation
    if (!form.excerpt.trim() || form.excerpt.trim().length < 15) {
      toast.error('Please provide a meaningful summary/excerpt (at least 15 characters).', 'Validation Error');
      return;
    }

    // 4. Article Content validation (At least 200 characters including spaces)
    const contentLength = getTextLength(form.content);
    if (contentLength < 200) {
      toast.error(
        `Article content must be at least 200 characters long including spaces. Current text length: ${contentLength} characters (${200 - contentLength} more needed).`,
        'Article Too Short'
      );
      return;
    }

    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        author: form.author.trim() || user?.name || 'TESCA Team',
        category: form.category || 'Spoken English',
        image_url: form.image_url,
        published: form.published,
        created_at: editingPost ? editingPost.created_at : new Date().toISOString(),
        author_id: editingPost ? editingPost.author_id : user?.id,
      };

      if (editingPost) {
        await db.updateBlogPost(editingPost.id, payload);
        toast.success('Blog post updated successfully', 'Post Updated');
      } else {
        await db.createBlogPost(payload);
        toast.success('New blog post created successfully', 'Post Created');
      }

      resetForm();
      setIsAdding(false);
      loadPosts();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to save blog post', 'Error');
    }
  };

  const handleDelete = async () => {
    if (deletePostId) {
      try {
        await db.deleteBlogPost(deletePostId);
        setDeletePostId(null);
        toast.success('Blog post deleted successfully', 'Post Removed');
        loadPosts();
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete blog post', 'Delete Error');
      }
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      await db.updateBlogPost(id, { published: !current });
      toast.info(!current ? 'Blog post published' : 'Blog post reverted to draft', 'Post Status');
      loadPosts();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update publish status', 'Error');
    }
  };

  const getCategoryStyle = (cat?: string) => {
    switch (cat) {
      case 'IELTS':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'PTE':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Spoken English':
      default:
        return 'bg-teal-50 text-teal-700 border-teal-100';
    }
  };

  const filtered = posts
    .filter((post) => {
      if (user?.role === 'admin') return true;
      return post.published || post.author_id === user?.id;
    })
    .filter((post) => {
      if (selectedCategory === 'All') return true;
      const postCat = post.category || 'Spoken English';
      return postCat === selectedCategory;
    })
    .filter((p) =>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
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
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  Featured Image <span className="text-rose-500 font-bold">*</span> (Max 500 KB)
                </label>
                <div className="flex items-center gap-3">
                  {form.image_url ? (
                    <div className="relative h-[38px] w-[38px] rounded-xl overflow-hidden border border-gray-200 group shrink-0">
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
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100/50 cursor-pointer truncate"
                    >
                      <Plus className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="truncate">Upload Image *</span>
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
                {imageError ? (
                  <p className="text-[10px] text-rose-500 font-semibold mt-1">{imageError}</p>
                ) : !form.image_url && (
                  <p className="text-[10px] text-amber-600 font-medium mt-1">⚠️ Required to save</p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Excerpt / Summary * (Min. 15 characters)</label>
              <textarea
                placeholder="Brief description for the blog listing..."
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none h-20 resize-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[#4F6C8D] uppercase tracking-wider">
                  Article Content <span className="text-rose-500">*</span>
                </label>
              </div>
              <RichTextEditor
                value={form.content}
                onChange={(val) => setForm({ ...form, content: val })}
                placeholder="Write your professional blog post content here... Minimum 200 characters required."
              />
              {(() => {
                const currentLen = getTextLength(form.content);
                const isValid = currentLen >= 200;
                return (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] pt-1 gap-1">
                    <span className="text-gray-400">Article text must be at least 200 characters including spaces.</span>
                    <span className={`font-bold px-2.5 py-0.5 rounded-md text-[10px] w-fit ${isValid ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                      {isValid ? `✓ ${currentLen} characters (Meets 200 character minimum)` : `⚠️ ${currentLen} / 200 min characters (${200 - currentLen} more needed)`}
                    </span>
                  </div>
                );
              })()}
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
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 w-full sm:w-[260px] shadow-soft">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                    selectedCategory === cat
                      ? 'bg-primary text-white border-primary shadow-soft'
                      : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {!loading && filtered.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-gray-50 to-teal-50/30 border border-gray-200/80 rounded-2xl p-3 px-4 shadow-xs">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="select-all-posts"
                  checked={
                    filtered.filter(canManage).length > 0 &&
                    filtered.filter(canManage).every((p) => selectedPostIds.includes(p.id))
                  }
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="select-all-posts" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
                  Select All ({filtered.filter(canManage).length})
                </label>
                {selectedPostIds.length > 0 && (
                  <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[11px] font-extrabold rounded-full border border-primary/20">
                    {selectedPostIds.length} selected
                  </span>
                )}
              </div>

              {selectedPostIds.length > 0 ? (
                <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200">
                  <span className="text-[11px] font-bold text-gray-600 shrink-0">1-Click Category Change:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        disabled={isBulkUpdating}
                        onClick={() => handleBulkCategoryChange(cat)}
                        className="px-3 py-1.5 bg-white border border-gray-200 hover:border-primary hover:bg-primary-50 text-primary rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1"
                        title={`Move ${selectedPostIds.length} selected post(s) to ${cat}`}
                      >
                        → {cat}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedPostIds([])}
                    className="px-2 py-1 text-xs font-semibold text-gray-400 hover:text-gray-700 underline shrink-0 ml-1"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-gray-400 font-medium hidden sm:inline">
                  Check boxes to edit multiple blog categories in 1 click
                </span>
              )}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-gray-400">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">No blog posts found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((post) => (
                <div
                  key={post.id}
                  className={`bg-white border rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all duration-300 ${
                    selectedPostIds.includes(post.id)
                      ? 'border-primary ring-2 ring-primary/20 bg-primary/[0.01]'
                      : !post.published
                      ? 'opacity-60 bg-gray-50/55'
                      : 'border-gray-100/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      {canManage(post) && (
                        <div className="pt-0.5 shrink-0">
                          <input
                            type="checkbox"
                            checked={selectedPostIds.includes(post.id)}
                            onChange={() => toggleSelectPost(post.id)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-800 truncate">{post.title}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center gap-3 mt-2.5 text-[10px] text-gray-400 font-semibold flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getCategoryStyle(post.category)}`}>
                            {post.category || 'Spoken English'}
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
                    </div>
                    {canManage(post) && (
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
                    )}
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
