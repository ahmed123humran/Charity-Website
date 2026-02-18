'use client';

import GuidedTour, { TourStep } from './GuidedTour';

export default function PagesTour() {
    const tourSteps: TourStep[] = [
        {
            target: '#new-page-btn',
            title: 'إنشاء صفحة جديدة',
            content: 'ابدأ بإضافة صفحات جديدة لموقعك مثل (اتصل بنا، سياسة الخصوصية، الخ).',
        },
        {
            target: '#pages-list',
            title: 'إدارة الصفحات',
            content: 'يمكنك هنا رؤية جميع الصفحات، حالتها (منشورة أو مسودة)، ورابط كل منها.',
        },
        {
            target: '#design-page-action',
            title: 'المصمم التفاعلي',
            content: 'هذه الأيقونة تفتح لك مصمم الصفحات السهل لبناء محتوى الصفحة بالسحب والإفلات.',
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="pages_management_tour" />;
}
