'use client';

import GuidedTour, { TourStep } from './GuidedTour';

export default function SocialMediaTour() {
    const tourSteps: TourStep[] = [
        {
            target: '#new-social-btn',
            title: 'ربط الحسابات',
            content: 'أضف روابط حسابات التواصل الاجتماعي الخاصة بالجمعية لتظهر في الموقع.',
        },
        {
            target: '#social-list',
            title: 'الحسابات المضافة',
            content: 'تحكم في الحسابات المضافة، قم بتعديل الروابط أو إخفاء منصات معينة.',
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="social_media_tour" />;
}
