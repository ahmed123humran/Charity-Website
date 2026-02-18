'use client';

import GuidedTour, { TourStep } from './GuidedTour';

export default function MenusTour() {
    const tourSteps: TourStep[] = [
        {
            target: '#new-menu-btn',
            title: 'إنشاء قائمة جديدة',
            content: 'أنشئ قوائم التنقل (Navigation Menus) لترتيب روابط موقعك.',
        },
        {
            target: '#menus-list',
            title: 'ترتيب الروابط',
            content: 'من هنا يمكنك إضافة روابط للقائمة، ترتيبها، وتحديد مكان ظهورها في الموقع.',
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="menus_management_tour" />;
}
