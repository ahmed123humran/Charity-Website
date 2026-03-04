'use client';

import { useTranslations } from 'next-intl';
import GuidedTour, { TourStep } from './GuidedTour';

export default function MenusTour() {
    const t = useTranslations('Tours.menus');

    const tourSteps: TourStep[] = [
        {
            target: '#new-menu-btn',
            title: t('step1_title'),
            content: t('step1_content'),
        },
        {
            target: '#menus-list tbody tr:first-child',
            title: t('step2_title'),
            content: t('step2_content'),
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="menus_management_tour" />;
}
