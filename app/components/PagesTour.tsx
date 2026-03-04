'use client';

import { useTranslations } from 'next-intl';
import GuidedTour, { TourStep } from './GuidedTour';

export default function PagesTour() {
    const t = useTranslations('Tours.pages');

    const tourSteps: TourStep[] = [
        {
            target: '#new-page-btn',
            title: t('step1_title'),
            content: t('step1_content'),
        },
        {
            target: '#pages-list tbody tr:first-child',
            title: t('step2_title'),
            content: t('step2_content'),
        },
        {
            target: '#design-page-action',
            title: t('step3_title'),
            content: t('step3_content'),
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="pages_management_tour" />;
}
