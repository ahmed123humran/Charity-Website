'use client';

import { useTranslations } from 'next-intl';
import GuidedTour, { TourStep } from './GuidedTour';

export default function SocialMediaTour() {
    const t = useTranslations('Tours.social');

    const tourSteps: TourStep[] = [
        {
            target: '#new-social-btn',
            title: t('step1_title'),
            content: t('step1_content'),
        },
        {
            target: '#social-list tbody tr:first-child',
            title: t('step2_title'),
            content: t('step2_content'),
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="social_media_tour" />;
}
