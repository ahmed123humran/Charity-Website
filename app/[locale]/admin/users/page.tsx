'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User as UserIcon, Mail, Shield } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/app/components/ConfirmDialog';
import { useAppSelector } from '@/app/store/hooks';
import UsersTour from '@/app/components/UsersTour';
import { Info } from 'lucide-react';

interface User {
    id: number;
    name: string | null;
    email: string;
    role: 'ADMIN' | 'EDITOR' | 'VIEWER';
    createdAt: string;
}

export default function UsersManagement() {
    const t = useTranslations('Admin');
    const commonT = useTranslations('Common');
    const locale = useLocale();
    const { role: userRole } = useAppSelector((state) => state.user);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'ADMIN' | 'EDITOR' | 'VIEWER'>('EDITOR');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error(commonT('error'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isEditing ? `/api/users/${currentId}` : '/api/users';
            const method = isEditing ? 'PUT' : 'POST';

            const body: any = { name, email, role };
            if (password) body.password = password;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                closeModal();
                fetchUsers();
                toast.success(isEditing ? commonT('updated') : commonT('created'));
            } else {
                const err = await res.json();
                if (Array.isArray(err)) {
                    err.forEach((e: any) => toast.error(t(e.message) || e.message));
                } else {
                    toast.error(err.message || commonT('error'));
                }
            }
        } catch (error) {
            console.error(`Failed to ${isEditing ? 'update' : 'create'} user:`, error);
            toast.error(commonT('error'));
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await fetch(`/api/users/${deleteId}`, { method: 'DELETE' });
            if (res.ok) {
                fetchUsers();
                toast.success(commonT('deleted'));
            } else {
                toast.error(commonT('error'));
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
            toast.error(commonT('error'));
        }
    };

    const openEditModal = (user: User) => {
        setName(user.name || '');
        setEmail(user.email);
        setRole(user.role);
        setPassword(''); // Don't show old password
        setCurrentId(user.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setName('');
        setEmail('');
        setPassword('');
        setRole('EDITOR');
        setCurrentId(null);
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN': return <span className="px-2 py-1 rounded-md bg-red-100 text-red-700 text-xs font-bold">{t('adminRole')}</span>;
            case 'EDITOR': return <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">{t('editorRole')}</span>;
            case 'VIEWER': return <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">{t('viewerRole')}</span>;
            default: return null;
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 font-bold">{commonT('loading')}</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <UsersTour />
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t('userManagement')}</h1>
                    <p className="text-slate-500 mt-1">{t('manageUsers')}</p>
                </div>
                {userRole === 'ADMIN' && (
                    <button
                        id="new-user-btn"
                        onClick={() => {
                            setIsEditing(false);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-sm cursor-pointer"
                    >
                        <Plus className="w-5 h-5" />
                        {t('newUser')}
                    </button>
                )}
            </div>

            <div id="users-list" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-start border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-start">{t('user')}</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-start">{t('emailAddress')}</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-start">{t('role')}</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-start">{t('joined')}</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-end">{commonT('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                                                {user.name?.[0] || user.email?.[0]?.toUpperCase() || 'A'}
                                            </div>
                                            <span className="font-semibold text-slate-900">{user.name || 'Admin'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Mail className="w-4 h-4" />
                                            {user.email || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {new Date(user.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                                    </td>
                                    <td className="px-6 py-4 text-end">
                                        <div className="flex justify-end gap-2">
                                            {userRole === 'ADMIN' && (
                                                <>
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-2 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                                        title={commonT('edit')}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(user.id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                                        title={commonT('delete')}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="user-roles-info" className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm text-primary">
                    <Info size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">{t('role')} {t('information') || 'معلومات الصلاحيات'}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                        {t('rolesDescription') || 'كل دور له صلاحيات محددة: المسؤول يتحكم بكل شيء، المحرر يدير المحتوى فقط، والمشاهد يستعرض البيانات.'}
                    </p>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">
                                {isEditing ? t('editUser') : t('newUser')}
                            </h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 cursor-pointer text-2xl">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('fullName')}</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 rtl:left-auto rtl:right-3" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-hidden rtl:pl-4 rtl:pr-10 text-start"
                                        placeholder={t('fullName')}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('emailAddress')}</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 rtl:left-auto rtl:right-3" />
                                    <input
                                        type="email"
                                        required={!isEditing}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-hidden rtl:pl-4 rtl:pr-10 text-start"
                                        placeholder={t('emailAddress')}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('role')}</label>
                                <select
                                    value={role}
                                    onChange={(e: any) => setRole(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-hidden"
                                >
                                    <option value="ADMIN">{t('adminRole')}</option>
                                    <option value="EDITOR">{t('editorRole')}</option>
                                    <option value="VIEWER">{t('viewerRole')}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 whitespace-pre-wrap">
                                    {isEditing ? t('newPasswordHint') : t('password')}
                                </label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 rtl:left-auto rtl:right-3" />
                                    <input
                                        type="password"
                                        required={!isEditing}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-hidden rtl:pl-4 rtl:pr-10 text-start"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    {commonT('cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 cursor-pointer"
                                >
                                    {isEditing ? commonT('saveChanges') : t('createAccount')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title={commonT('delete')}
                message={commonT('confirmDelete')}
                isDeleting
            />
        </div>
    );
}
