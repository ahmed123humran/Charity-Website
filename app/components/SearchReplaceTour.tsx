'use client';

import GuidedTour, { TourStep } from './GuidedTour';

export default function SearchReplaceTour() {
    const tourSteps: TourStep[] = [
        {
            target: '#search-replace-form',
            title: 'البحث والاستبدال الذكي',
            content: 'يمكنك تغيير نصوص معينة في كامل الموقع بضغطة واحدة، مفيد لتحديث الروابط أو الأسماء المكررة.',
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="search_replace_tour" />;
}
