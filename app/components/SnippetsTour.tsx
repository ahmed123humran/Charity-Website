'use client';

import GuidedTour, { TourStep } from './GuidedTour';

export default function SnippetsTour() {
    const tourSteps: TourStep[] = [
        {
            target: '#new-snippet-btn',
            title: 'المكونات المخصصة',
            content: 'أنشئ قطع محتوى جاهزة (Snippets) لاستخدامها بشكل متكرر في صفحات مختلفة.',
        },
        {
            target: '#snippets-list',
            title: 'مكتبة المكونات',
            content: 'هنا تجد كل القطع البرمجية أو التصميمية التي قمت بحفظها لإعادة الاستخدام.',
        },
        {
            target: '#snippet-editor-modal',
            title: 'محرر المكونات',
            content: 'يمكنك تعديل المكون برمجياً كـ HTML أو مرئياً باستخدام السحب والإفلات.',
            position: 'center'
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="snippets_management_tour" />;
}
