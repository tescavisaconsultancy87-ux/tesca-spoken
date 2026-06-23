'use client';

import { useState, useEffect } from 'react';
import { Search, UserPlus, Filter, MoreVertical, Edit2, Trash2, ShieldAlert, Check, X } from 'lucide-react';
import { db } from '@/lib/db';
import { CopyButton } from '@/components/animate-ui/components/buttons/copy';
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

interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  course: string;
  joinedDate: string;
  status: 'active' | 'suspended' | 'pending';
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinedDate: string;
  status: 'active' | 'suspended' | 'pending';
}

export default function AdminStudentsPage() {
  const [activeTab, setActiveTab] = useState<'students' | 'admins'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');
  
  const [students, setStudents] = useState<Student[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const studentsData = await db.getStudents();
      const adminsData = await (db as any).getAdmins();
      setStudents(studentsData as any);
      setAdmins(adminsData as any);
      setLoading(false);
    }
    load();
  }, []);

  const [isAdding, setIsAdding] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [successCredentials, setSuccessCredentials] = useState<{ email: string; password: string; warning?: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; role: 'student' | 'admin' } | null>(null);

  const [newForm, setNewForm] = useState({
    name: '',
    email: '',
    role: 'student' as 'student' | 'admin',
    phone: '',
    course: 'Spoken English Mastery'
  });

  // Filter Data
  const filteredStudents = students.filter((s) => {
    const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const filteredAdmins = admins.filter((a) => {
    const matchesQuery = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSubmitting(true);

    // Validate phone number: exactly 10 digits
    const cleanedPhone = newForm.phone.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      setValidationError('Phone number must be exactly 10 digits.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newForm.name,
          email: newForm.email,
          role: newForm.role,
          phone: newForm.phone,
          course: newForm.role === 'student' ? newForm.course : undefined
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create user account.');
      }

      // Add locally to the state
      const dateString = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      if (newForm.role === 'student') {
        const newStudentObj: Student = {
          id: result.userId || `stud-${Date.now()}`,
          name: newForm.name,
          email: newForm.email,
          phone: newForm.phone,
          course: newForm.course,
          joinedDate: dateString,
          status: 'active'
        };
        setStudents([newStudentObj, ...students]);
      } else {
        const newAdminObj: AdminUser = {
          id: result.userId || `admin-${Date.now()}`,
          name: newForm.name,
          email: newForm.email,
          phone: newForm.phone,
          joinedDate: dateString,
          status: 'active'
        };
        setAdmins([newAdminObj, ...admins]);
      }

      // Show success popup with the generated password
      setSuccessCredentials({
        email: newForm.email,
        password: result.password,
        warning: result.warning
      });

      // Clear Form and close addition modal
      setNewForm({
        name: '',
        email: '',
        role: 'student',
        phone: '',
        course: 'Spoken English Mastery'
      });
      setIsAdding(false);
    } catch (err: any) {
      setValidationError(err.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = (id: string, role: 'student' | 'admin') => {
    setDeleteConfirm({ id, role });
  };

  const handleToggleStatus = (id: string, role: 'student' | 'admin', status: 'active' | 'suspended') => {
    if (role === 'student') {
      setStudents(students.map(s => s.id === id ? { ...s, status } : s));
    } else {
      setAdmins(admins.map(a => a.id === id ? { ...a, status } : a));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">User Directories</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Manage and track student and administrator accounts</p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-primary hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition-all shadow-soft self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          Add User / Admin
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('students')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'students'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Students ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('admins')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'admins'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Administrators ({admins.length})
        </button>
      </div>

      {/* Filters and Search toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 w-full md:w-[280px] shadow-soft">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'students' ? 'students' : 'admins'} by name or email...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
          {['all', 'active', 'pending', 'suspended'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                statusFilter === status
                  ? 'bg-primary-50 text-primary border border-primary-200'
                  : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Add User Modal overlay */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
              <h3 className="text-base font-bold text-gray-800">Add New User</h3>
              <button onClick={() => { setIsAdding(false); setValidationError(''); }} className="p-1 rounded-lg text-gray-400 hover:bg-gray-50 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            {validationError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold">
                {validationError}
              </div>
            )}
            <form onSubmit={handleAddUser} className="space-y-4 pt-4">
              {/* Role Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Account Role</label>
                <select
                  value={newForm.role}
                  onChange={(e) => setNewForm({ ...newForm, role: e.target.value as any })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                >
                  <option value="student">Student (User)</option>
                  <option value="admin">Administrator (Admin)</option>
                </select>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Kumar"
                  value={newForm.name}
                  onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Email Address</label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={newForm.email}
                  onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Phone Number (10 digits)</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={newForm.phone}
                  onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>

              {/* Course Selection (Only for Student) */}
              {newForm.role === 'student' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Select Course</label>
                  <select
                    value={newForm.course}
                    onChange={(e) => setNewForm({ ...newForm, course: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  >
                    <option>Spoken English Mastery</option>
                    <option>Business Communication</option>
                    <option>Vocabulary Accelerator</option>
                  </select>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => { setIsAdding(false); setValidationError(''); }}
                  className="px-4 py-2.5 rounded-xl border border-gray-150 text-gray-500 text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-600 shadow-soft disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Credentials Modal */}
      {successCredentials && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-scale-up text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
              <Check className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Account Created Successfully!</h3>
            <p className="text-xs text-gray-400 mt-1">Credentials have been generated for the user.</p>

            {successCredentials.warning && (
              <div className="mt-3 p-2 bg-amber-50 border border-amber-100 text-amber-700 rounded-lg text-[10px] font-semibold text-left">
                ⚠️ {successCredentials.warning}
              </div>
            )}

            <div className="mt-5 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-left space-y-3">
              <div className="text-xs text-gray-500 flex items-center justify-between">
                <span><strong>Email:</strong> <span className="font-mono text-gray-800 select-all bg-white px-2 py-0.5 rounded border border-gray-150">{successCredentials.email}</span></span>
                <CopyButton variant="ghost" size="sm" content={successCredentials.email} />
              </div>
              <div className="text-xs text-gray-500 flex items-center justify-between">
                <span><strong>Password:</strong> <span className="font-mono text-gray-800 font-bold select-all bg-white px-2 py-0.5 rounded border border-gray-150">{successCredentials.password}</span></span>
                <CopyButton variant="ghost" size="sm" content={successCredentials.password} />
              </div>
            </div>

            <button
              onClick={() => setSuccessCredentials(null)}
              className="mt-6 w-full px-5 py-3 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-600 transition-all cursor-pointer shadow-soft"
            >
              Done & Close
            </button>
          </div>
        </div>
      )}

      {/* Directory Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'students' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Student Info</th>
                  <th className="p-4 sm:p-5">Enrolled Course</th>
                  <th className="p-4 sm:p-5">Joined Date</th>
                  <th className="p-4 sm:p-5">Status</th>
                  <th className="p-4 sm:p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                      No matching student records found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="p-4 sm:p-5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary-50 text-primary flex items-center justify-center font-bold">
                            {s.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{s.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-gray-500">{s.course}</td>
                      <td className="p-4 sm:p-5 text-gray-400">{s.joinedDate}</td>
                      <td className="p-4 sm:p-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            s.status === 'active'
                              ? 'bg-emerald-50 text-emerald-600'
                              : s.status === 'pending'
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {s.status}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 text-right">
                        <div className="inline-flex items-center gap-2">
                          {s.status === 'active' ? (
                            <button
                              onClick={() => handleToggleStatus(s.id, 'student', 'suspended')}
                              className="p-1.5 rounded-lg border border-gray-100 text-amber-600 hover:bg-amber-50 cursor-pointer"
                              title="Suspend Student"
                            >
                              <ShieldAlert className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(s.id, 'student', 'active')}
                              className="p-1.5 rounded-lg border border-gray-100 text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                              title="Activate Student"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(s.id, 'student')}
                            className="p-1.5 rounded-lg border border-gray-100 text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Delete Student"
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
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Admin Info</th>
                  <th className="p-4 sm:p-5">Role</th>
                  <th className="p-4 sm:p-5">Joined Date</th>
                  <th className="p-4 sm:p-5">Status</th>
                  <th className="p-4 sm:p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                      No matching admin records found.
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="p-4 sm:p-5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary-50 text-primary flex items-center justify-center font-bold">
                            {a.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{a.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{a.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-gray-500">Administrator</td>
                      <td className="p-4 sm:p-5 text-gray-400">{a.joinedDate}</td>
                      <td className="p-4 sm:p-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            a.status === 'active'
                              ? 'bg-emerald-50 text-emerald-600'
                              : a.status === 'pending'
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {a.status}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 text-right">
                        <div className="inline-flex items-center gap-2">
                          {a.status === 'active' ? (
                            <button
                              onClick={() => handleToggleStatus(a.id, 'admin', 'suspended')}
                              className="p-1.5 rounded-lg border border-gray-100 text-amber-600 hover:bg-amber-50 cursor-pointer"
                              title="Suspend Admin"
                            >
                              <ShieldAlert className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(a.id, 'admin', 'active')}
                              className="p-1.5 rounded-lg border border-gray-100 text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                              title="Activate Admin"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(a.id, 'admin')}
                            className="p-1.5 rounded-lg border border-gray-100 text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Delete Admin"
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
          )}
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
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
                Delete {deleteConfirm?.role === 'admin' ? 'Administrator' : 'Student'}?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-center text-gray-500 mt-2">
                Are you absolutely sure you want to delete this {deleteConfirm?.role}? This action will permanently remove their profile data from the system and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-6 flex justify-end gap-3 w-full">
              <AlertDialogClose className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer border border-gray-200">
                Cancel
              </AlertDialogClose>
              <button
                type="button"
                onClick={async () => {
                  if (deleteConfirm) {
                    await db.deleteStudentProfile(deleteConfirm.id);
                    if (deleteConfirm.role === 'student') {
                      setStudents(students.filter(s => s.id !== deleteConfirm.id));
                    } else {
                      setAdmins(admins.filter(a => a.id !== deleteConfirm.id));
                    }
                    setDeleteConfirm(null);
                  }
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-soft"
              >
                Delete Account
              </button>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>
    </div>
  );
}

