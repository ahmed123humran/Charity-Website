'use client';

import GuidedTour, { TourStep } from './GuidedTour';

export default function UsersTour() {
    const tourSteps: TourStep[] = [
        {
            target: '#new-user-btn',
            title: 'إضافة مستخدم جديد',
            content: 'يمكنك إضافة مديرين أو محررين جدد للمساهمة في إدارة المحتوى.',
        },
        {
            target: '#users-list',
            title: 'قائمة المستخدمين',
            content: 'هنا يمكنك استعراض جميع المستخدمين المسجلين، تعديل صلاحياتهم، أو إزالتهم.',
        },
        {
            target: '#user-roles-info',
            title: 'الأدوار والصلاحيات',
            content: 'يدعم النظام مستويات وصول مختلفة: (مدير) للتحكم الكامل، (محرر) للمحتوى فقط، و(مشاهد) للقراءة.',
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="users_management_tour" />;
}
