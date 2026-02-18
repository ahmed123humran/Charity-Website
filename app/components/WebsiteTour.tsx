'use client';

import GuidedTour, { TourStep } from './GuidedTour';

export default function WebsiteTour() {
    const tourSteps: TourStep[] = [
        {
            target: '#new-website-btn',
            title: 'إضافة موقع جديد',
            content: 'انقر هنا لبدء عملية إنشاء موقع إلكتروني جديد لجمعية أو جهة أخرى.',
        },
        {
            target: '#website-table',
            title: 'قائمة المواقع',
            content: 'هنا تظهر جميع المواقع التي قمت بإنشائها، يمكنك تعديلها أو حذفها من قسم الإجراءات.',
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="website_management_tour" />;
}
