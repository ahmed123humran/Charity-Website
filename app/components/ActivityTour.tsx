'use client';

import { useTranslations } from 'next-intl';
import GuidedTour, { TourStep } from './GuidedTour';

export default function ActivityTour() {
    const t = useTranslations('Tours.activity');

    const tourSteps: TourStep[] = [
        {
            target: '#activity-logs-list tbody tr:first-child',
            title: t('step1_title'),
            content: t('step1_content'),
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="activity_logs_tour" />;
}
