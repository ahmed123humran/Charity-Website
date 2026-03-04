'use client';

import { useTranslations } from 'next-intl';
import GuidedTour, { TourStep } from './GuidedTour';

export default function EditorTour() {
    const t = useTranslations('Tours.editor');

    const tourSteps: TourStep[] = [
        {
            target: '#editor-snippets',
            title: t('step1_title'),
            content: t('step1_content'),
        },
        {
            target: '#editor-canvas',
            title: t('step2_title'),
            content: t('step2_content'),
        },
        {
            target: '#editor-sidebar',
            title: t('step3_title'),
            content: t('step3_content'),
        },
        {
            target: '#save-button',
            title: t('step4_title'),
            content: t('step4_content'),
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="editor_tour" />;
}
