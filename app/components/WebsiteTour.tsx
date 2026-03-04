'use client';

import { useTranslations } from 'next-intl';
import GuidedTour, { TourStep } from './GuidedTour';

export default function WebsiteTour() {
    const t = useTranslations('Tours.websites');

    const tourSteps: TourStep[] = [
        {
            target: '#new-website-btn',
            title: t('step1_title'),
            content: t('step1_content'),
        },
        {
            target: '#website-table tbody tr:first-child',
            title: t('step2_title'),
            content: t('step2_content'),
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="website_management_tour" />;
}
