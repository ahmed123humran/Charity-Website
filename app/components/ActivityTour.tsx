'use client';

import GuidedTour, { TourStep } from './GuidedTour';

export default function ActivityTour() {
    const tourSteps: TourStep[] = [
        {
            target: '#activity-logs-list',
            title: 'سجل النشاطات',
            content: 'راقب كل العمليات التي تتم في لوحة التحكم للحفاظ على أمان وسلامة البيانات.',
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="activity_logs_tour" />;
}
