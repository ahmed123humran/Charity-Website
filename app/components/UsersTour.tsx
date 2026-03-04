'use client';

import { useTranslations } from 'next-intl';
import GuidedTour, { TourStep } from './GuidedTour';

export default function UsersTour() {
    const t = useTranslations('Tours.users');

    const tourSteps: TourStep[] = [
        {
            target: '#new-user-btn',
            title: t('step1_title'),
            content: t('step1_content'),
        },
        {
            target: '#users-list',
            title: t('step2_title'),
            content: t('step2_content'),
        },
        {
            target: '#user-roles-info',
            title: t('step3_title'),
            content: t('step3_content'),
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="users_management_tour" />;
}
