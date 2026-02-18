'use client';

import GuidedTour, { TourStep } from './GuidedTour';

export default function DashboardTour() {
    const tourSteps: TourStep[] = [
        {
            target: '#nav--admin',
            title: 'لوحة التحكم',
            content: 'هنا يمكنك مشاهدة إحصائيات سريعة عن موقعك وصفحاتك.',
        },
        {
            target: '#nav--admin-websites',
            title: 'إدارة المواقع',
            content: 'من هنا يمكنك التحكم في إعدادات الموقع، الشعار، والألوان.',
        },
        {
            target: '#nav--admin-pages',
            title: 'الصفحات',
            content: 'أنشئ صفحات جديدة وقم بتحرير محتواها بكل سهولة.',
        },
        {
            target: '#nav--admin-snippets',
            title: 'المكونات الجاهزة',
            content: 'استخدم المكونات الجاهزة لبناء صفحاتك بسرعة واحترافية.',
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="admin_dashboard_tour" />;
}
