'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User as UserIcon, Mail, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

interface User {
    id: number;
    name: string | null;
    email: string;
    createdAt: string;
}

export default function UsersManagement() {
    const t = useTranslations('Admin');
    const commonT = useTranslations('Common');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isEditing ? `/api/users/${currentId}` : '/api/users';
            const method = isEditing ? 'PUT' : 'POST';

            const body: any = { name, email };
            if (password) body.password = password;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                closeModal();
                fetchUsers();
                toast.success(isEditing ? 'User updated successfully' : 'User created successfully');
            } else {
                const err = await res.json();
                toast.error(err.message || 'Error occurred');
            }
        } catch (error) {
            console.error(`Failed to ${isEditing ? 'update' : 'create'} user:`, error);
            toast.error(`Failed to ${isEditing ? 'update' : 'create'} user`);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(commonT('confirmDelete'))) return;
        try {
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
            if (res.ok) fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const openEditModal = (user: User) => {
        setName(user.name || '');
        setEmail(user.email);
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
        setCurrentId(null);
    };

    if (loading) return <div className="p-8 text-center text-slate-500 font-bold">{commonT('signIn')}...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t('userManagement')}</h1>
                    <p className="text-slate-500 mt-1">{t('manageUsers')}</p>
                </div>
                <button
                    onClick={() => {
                        setIsEditing(false);
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    {t('newUser')}
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-start border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-start">{t('user')}</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-start">{t('emailAddress')}</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-start">{t('joined')}</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-end">{commonT('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                            {user.name?.[0] || user.email[0].toUpperCase()}
                                        </div>
                                        <span className="font-semibold text-slate-900">{user.name || 'Admin'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Mail className="w-4 h-4" />
                                        {user.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-end">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => openEditModal(user)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                                            title={commonT('edit')}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                            title={commonT('delete')}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">
                                {isEditing ? t('editUser') : t('newUser')}
                            </h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">&times;</button>
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
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden rtl:pl-4 rtl:pr-10 text-start"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('emailAddress')}</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 rtl:left-auto rtl:right-3" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden rtl:pl-4 rtl:pr-10 text-start"
                                        placeholder="user@example.com"
                                    />
                                </div>
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
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden rtl:pl-4 rtl:pr-10 text-start"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                                >
                                    {commonT('cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                                >
                                    {isEditing ? commonT('saveChanges') : t('createAccount')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
