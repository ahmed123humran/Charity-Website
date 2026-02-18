'use client';

import GuidedTour, { TourStep } from './GuidedTour';

export default function FootersTour() {
    const tourSteps: TourStep[] = [
        {
            target: '#new-footer-btn',
            title: 'إدارة التذييلات',
            content: 'قم بتخصيص الجزء السفلي من موقعك (الفوتر) وإضافة الروابط والمعلومات المهمة.',
        },
        {
            target: '#footers-list',
            title: 'قائمة التذييلات',
            content: 'استعرض القوالب المستخدمة في أسفل الموقع وقم بتعديل محتواها.',
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="footers_management_tour" />;
}
