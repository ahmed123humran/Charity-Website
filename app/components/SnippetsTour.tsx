'use client';

import { useTranslations } from 'next-intl';
import GuidedTour, { TourStep } from './GuidedTour';

export default function SnippetsTour() {
    const t = useTranslations('Tours.snippets');

    const tourSteps: TourStep[] = [
        {
            target: '#new-snippet-btn',
            title: t('step1_title'),
            content: t('step1_content'),
        },
        {
            target: '#snippets-list > div:first-child',
            title: t('step2_title'),
            content: t('step2_content'),
        },
        {
            target: '#edit-snippet-btn-0',
            title: t('step3_title'),
            content: t('step3_content'),
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="snippets_management_tour" />;
}
