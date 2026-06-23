'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Eye, EyeOff, Edit, X } from 'lucide-react';
import { db } from '@/lib/db';
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
  category: string;
  author: string;
  publishDate: string;
  status: 'published' | 'draft';
}

export default function AdminBlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  const loadPosts = async () => {
    try {
      const data = await db.getBlogPosts();
      const mapped = (data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        author: p.author,
        publishDate: p.publish_date || p.publishDate || 'June 20, 2026',
        status: p.status
      }));
      setPosts(mapped);
    } catch (err) {
      console.error('Failed to load blog posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const [newPost, setNewPost] = useState({
    title: '',
    category: 'Grammar Tips',
    author: 'Sarah Jenkins',
  });

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `post-${Date.now()}`,
      title: newPost.title,
      category: newPost.category,
      author: newPost.author,
      publish_date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'draft' as const,
    };
    await db.createBlogPost(created);
    setNewPost({ title: '', category: 'Grammar Tips', author: 'Sarah Jenkins' });
    setIsAdding(false);
    loadPosts();
  };

  const handleDelete = (id: string) => {
    setDeletePostId(id);
  };

  const handleToggleStatus = async (id: string, currentStatus: 'published' | 'draft') => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    await db.updateBlogPostStatus(id, nextStatus);
    loadPosts();
  };

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Blog Content Manager</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Author articles, update learning guides, and moderate announcements</p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-primary hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition-all shadow-soft self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create Post
        </button>
      </div>

      {/* Toolbar */}
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

      {/* Add Post Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
              <h3 className="text-base font-bold text-gray-800">Create New Article Draft</h3>
              <button onClick={() => setIsAdding(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-50">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddPost} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Post Title</label>
                <input
                  type="text"
                  placeholder="e.g. Master English Pronunciation in 30 Days"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  >
                    <option>Grammar Tips</option>
                    <option>Career Growth</option>
                    <option>Vocabulary</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Author</label>
                  <select
                    value={newPost.author}
                    onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  >
                    <option>Sarah Jenkins</option>
                    <option>David Vance</option>
                    <option>Emma Watson</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-150 text-gray-500 text-xs font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-600 shadow-soft"
                >
                  Save Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Directory Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-4 sm:p-5">Post Title</th>
                <th className="p-4 sm:p-5">Category</th>
                <th className="p-4 sm:p-5">Author</th>
                <th className="p-4 sm:p-5">Publication Date</th>
                <th className="p-4 sm:p-5">Status</th>
                <th className="p-4 sm:p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400 font-medium">
                    No articles found matching search query.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-4 sm:p-5 max-w-[280px]">
                      <p className="font-bold text-gray-800 truncate leading-snug">{p.title}</p>
                    </td>
                    <td className="p-4 sm:p-5 text-gray-550">{p.category}</td>
                    <td className="p-4 sm:p-5 text-gray-500">{p.author}</td>
                    <td className="p-4 sm:p-5 text-gray-400">{p.publishDate}</td>
                    <td className="p-4 sm:p-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.status === 'published'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-gray-150 text-gray-500'
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(p.id, p.status)}
                          className={`p-1.5 rounded-lg border border-gray-100 transition-colors ${
                            p.status === 'published'
                              ? 'text-gray-500 hover:bg-gray-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={p.status === 'published' ? 'Unpublish Draft' : 'Publish Article'}
                        >
                          {p.status === 'published' ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg border border-gray-100 text-rose-600 hover:bg-rose-50"
                          title="Delete Post"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deletePostId !== null} onOpenChange={(open) => { if (!open) setDeletePostId(null); }}>
        <AlertDialogPortal>
          <AlertDialogBackdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <AlertDialogPopup
            from="bottom"
            className="sm:max-w-md fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 border bg-white rounded-3xl p-6 shadow-2xl"
          >
            <AlertDialogHeader>
              <div className="mx-auto h-12 w-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4 border border-rose-100 shadow-soft">
                <Trash2 className="h-6 w-6" />
              </div>
              <AlertDialogTitle className="text-lg font-bold text-center text-gray-800">
                Delete Article?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-center text-gray-500 mt-2">
                Are you absolutely sure you want to delete this article? This action cannot be undone and the post will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-6 flex justify-end gap-3 w-full">
              <AlertDialogClose className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer border border-gray-200">
                Cancel
              </AlertDialogClose>
              <button
                type="button"
                onClick={async () => {
                  if (deletePostId) {
                    await db.deleteBlogPost(deletePostId);
                    loadPosts();
                    setDeletePostId(null);
                  }
                }}
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

