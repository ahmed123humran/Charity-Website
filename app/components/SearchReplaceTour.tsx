'use client';

import { useTranslations } from 'next-intl';
import GuidedTour, { TourStep } from './GuidedTour';

export default function SearchReplaceTour() {
    const t = useTranslations('Tours.searchReplace');

    const tourSteps: TourStep[] = [
        {
            target: '#search-replace-form',
            title: t('step1_title'),
            content: t('step1_content'),
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="search_replace_tour" />;
}
