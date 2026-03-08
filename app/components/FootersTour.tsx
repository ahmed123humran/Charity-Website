'use client';

import { useTranslations } from 'next-intl';
import GuidedTour, { TourStep } from './GuidedTour';

export default function FootersTour() {
    const t = useTranslations('Tours.footers');

    const tourSteps: TourStep[] = [
        {
            target: '#new-footer-btn',
            title: t('step1_title'),
            content: t('step1_content'),
        },
        {
            target: '#footers-list tbody tr:first-child',
            title: t('step2_title'),
            content: t('step2_content'),
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="footers_management_tour" />;
}
