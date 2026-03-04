'use client';

import { useTranslations } from 'next-intl';
import GuidedTour, { TourStep } from './GuidedTour';

export default function DashboardTour() {
    const t = useTranslations('Tours.dashboard');

    const tourSteps: TourStep[] = [
        {
            target: '#nav--admin',
            title: t('step1_title'),
            content: t('step1_content'),
        },
        {
            target: '#nav--admin-websites',
            title: t('step2_title'),
            content: t('step2_content'),
        },
        {
            target: '#nav--admin-pages',
            title: t('step3_title'),
            content: t('step3_content'),
        },
        {
            target: '#nav--admin-snippets',
            title: t('step4_title'),
            content: t('step4_content'),
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="admin_dashboard_tour" />;
}
