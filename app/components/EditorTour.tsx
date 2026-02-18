'use client';

import GuidedTour, { TourStep } from './GuidedTour';

export default function EditorTour() {
    const tourSteps: TourStep[] = [
        {
            target: '#editor-sidebar',
            title: 'مكتبة المكونات',
            content: 'اسحب المكونات من هنا وأفلتها في منطقة التصميم لبناء صفحتك.',
        },
        {
            target: '#editor-canvas',
            title: 'منطقة التصميم',
            content: 'هنا يمكنك معاينة الصفحة مباشرة، والضغط على أي عنصر لتعديله أو حذفه.',
        },
        {
            target: '#save-button',
            title: 'حفظ التغييرات',
            content: 'بعد الانتهاء من التصميم، لا تنسَ حفظ التغييرات ليتم تحديث الموقع.',
        }
    ];

    return <GuidedTour steps={tourSteps} tourKey="editor_tour" />;
}
