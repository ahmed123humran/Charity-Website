// This file exists solely to tell Tailwind's JIT (Just-In-Time) compiler to generate these classes.
// Since snippets are loaded from the database dynamically, Tailwind cannot "see" their classes during build time.
// By listing them here, we guarantee they are always compiled and available for the Website Builder.
// TIP: If you need to use arbitrary values like w-[350px], you must explicitly add them to this list.

export const dynamicTailwindSafelist = [
    // Layout & Gradients
    'absolute', 'relative', 'inset-0', 'bg-gradient-to-l', 'bg-gradient-to-r', 'bg-gradient-to-t', 'bg-gradient-to-b',
    'min-h-screen', 'min-h-[calc(100vh-80px)]', 'min-h-[calc(100vh-5rem)]', 'z-10', 'container', 'mx-auto', 'max-w-6xl', 'max-w-2xl', 'max-w-4xl', 'max-w-5xl',
    'top-0', 'top-20', 'left-20', '-right-20', '-right-[42px]',
    'grid', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4',
    'lg:grid-cols-2', 'lg:grid-cols-3', 'lg:grid-cols-4',
    'col-span-1', 'col-span-2', 'lg:col-span-1', 'lg:col-span-2',

    // Primary Colors
    'bg-primary', 'text-primary', 'border-primary', 'from-primary', 'to-primary', 'ring-primary', 'fill-primary',

    // Primary Opacities
    'bg-primary/5', 'bg-primary/10', 'bg-primary/20', 'bg-primary/50', 'bg-primary/90',

    // Gradient Opacities
    'from-primary/90', 'to-primary/40', 'from-primary/10', 'to-primary/10', 'from-primary/20', 'to-primary/20',

    // Primary Hover States
    'hover:bg-primary', 'hover:text-primary', 'hover:border-primary',
    'hover:bg-primary/90', 'hover:bg-primary/80',
    'group-hover:bg-primary/10', 'group-hover:bg-primary/20', 'group-hover:text-primary',

    // Secondary Colors
    'bg-secondary', 'text-secondary', 'border-secondary', 'from-secondary', 'to-secondary', 'ring-secondary', 'fill-secondary',

    // Secondary Opacities
    'bg-secondary/5', 'bg-secondary/10', 'bg-secondary/20', 'bg-secondary/30', 'bg-secondary/40', 'bg-secondary/50', 'bg-secondary/60',
    'bg-secondary/70', 'bg-secondary/80', 'bg-secondary/90', 'shadow-secondary/30', 'border-secondary/50',

    // Secondary Hover States
    'hover:bg-secondary', 'hover:text-secondary', 'hover:bg-secondary-dark',
    'hover:text-primary', 'hover:bg-secondary/90',
    'group-hover:bg-secondary/10', 'group-hover:bg-secondary/20', 'group-hover:text-secondary',

    // Neutral & Gray Colors
    'bg-white', 'text-white', 'bg-gray-50', 'bg-gray-100', 'bg-gray-200', 'text-gray-100', 'text-gray-200', 'text-gray-800', 'bg-slate-100', 'text-slate-100',
    'bg-gray-50/30', 'bg-transparent', 'bg-red-50', 'text-red-600',
    'bg-black/10', 'bg-black/20', 'bg-black/30', 'bg-black/50',
    'bg-white/10', 'bg-white/20', 'bg-white/30', 'bg-white/5',

    // Opacities
    'opacity-10', 'opacity-20', 'opacity-40', 'opacity-50', 'opacity-80',

    // Common Utilities & Transitions
    'hover:-translate-y-1', 'backdrop-blur-sm', 'w-full', 'h-full', 'object-cover', 'flex', 'flex-col', 'flex-wrap', 'items-center', 'overflow-hidden',
    'pointer-events-none', 'transform', '-rotate-45', 'rtl:rotate-180',
    'transition-all', 'transition-colors', 'transition-transform', 'duration-300', 'duration-500',
    'group', 'group-hover:-translate-x-1', 'flex-row-reverse', 'md:flex-row-reverse', 'lg:flex-row-reverse', 'xl:flex-row-reverse',
    'mt-auto', 'shrink-0',

    // Hover Transforms & Spacing
    'hover:ms-2', 'hover:me-2', 'hover:translate-x-1', 'hover:-translate-x-1',

    // Borders & Shapes
    'border', 'border-2', 'border-4', 'border-gray-100', 'border-gray-200', 'border-b', 'border-t', 'border-r-4', 'border-t-4', 'border-b-4', 'border-l-4', 'border-white', 'border-white/10', 'border-white/20', 'border-white/30', 'border-none',
    'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full',

    // Shadows
    'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl',

    // Widths (Fractional)
    'w-1/2', 'w-1/3', 'w-2/3', 'w-1/4', 'w-2/4', 'w-3/4', 'w-1/5', 'w-2/5', 'w-3/5', 'w-4/5', 'w-1/6', 'w-2/6', 'w-3/6', 'w-4/6', 'w-5/6', 'w-1/12', 'w-2/12', 'w-3/12', 'w-4/12', 'w-5/12', 'w-6/12', 'w-7/12', 'w-8/12', 'w-9/12', 'w-10/12', 'w-11/12',

    // Responsive Widths (sm)
    'sm:w-1/2', 'sm:w-1/3', 'sm:w-2/3', 'sm:w-1/4', 'sm:w-2/4', 'sm:w-3/4', 'sm:w-1/5', 'sm:w-2/5', 'sm:w-3/5', 'sm:w-4/5', 'sm:w-1/6', 'sm:w-2/6', 'sm:w-3/6', 'sm:w-4/6', 'sm:w-5/6', 'sm:w-1/12', 'sm:w-2/12', 'sm:w-3/12', 'sm:w-4/12', 'sm:w-5/12', 'sm:w-6/12', 'sm:w-7/12', 'sm:w-8/12', 'sm:w-9/12', 'sm:w-10/12', 'sm:w-11/12',

    // Responsive Widths (md)
    'md:w-1/2', 'md:w-1/3', 'md:w-2/3', 'md:w-1/4', 'md:w-2/4', 'md:w-3/4', 'md:w-1/5', 'md:w-2/5', 'md:w-3/5', 'md:w-4/5', 'md:w-1/6', 'md:w-2/6', 'md:w-3/6', 'md:w-4/6', 'md:w-5/6', 'md:w-1/12', 'md:w-2/12', 'md:w-3/12', 'md:w-4/12', 'md:w-5/12', 'md:w-6/12', 'md:w-7/12', 'md:w-8/12', 'md:w-9/12', 'md:w-10/12', 'md:w-11/12',
    'md:h-auto',

    // Responsive Widths (lg)
    'lg:w-1/2', 'lg:w-1/3', 'lg:w-2/3', 'lg:w-1/4', 'lg:w-2/4', 'lg:w-3/4', 'lg:w-1/5', 'lg:w-2/5', 'lg:w-3/5', 'lg:w-4/5', 'lg:w-1/6', 'lg:w-2/6', 'lg:w-3/6', 'lg:w-4/6', 'lg:w-5/6', 'lg:w-1/12', 'lg:w-2/12', 'lg:w-3/12', 'lg:w-4/12', 'lg:w-5/12', 'lg:w-6/12', 'lg:w-7/12', 'lg:w-8/12', 'lg:w-9/12', 'lg:w-10/12', 'lg:w-11/12',

    // Responsive Widths (xl)
    'xl:w-1/2', 'xl:w-1/3', 'xl:w-2/3', 'xl:w-1/4', 'xl:w-2/4', 'xl:w-3/4', 'xl:w-1/5', 'xl:w-2/5', 'xl:w-3/5', 'xl:w-4/5', 'xl:w-1/6', 'xl:w-2/6', 'xl:w-3/6', 'xl:w-4/6', 'xl:w-5/6', 'xl:w-1/12', 'xl:w-2/12', 'xl:w-3/12', 'xl:w-4/12', 'xl:w-5/12', 'xl:w-6/12', 'xl:w-7/12', 'xl:w-8/12', 'xl:w-9/12', 'xl:w-10/12', 'xl:w-11/12',

    // Widths (Fixed)
    'w-screen', 'w-min', 'w-max', 'w-fit', 'w-0', 'w-px', 'w-1', 'w-2', 'w-3', 'w-4', 'w-5', 'w-6', 'w-8', 'w-10', 'w-12', 'w-16', 'w-20', 'w-24', 'w-32', 'w-40', 'w-48', 'w-56', 'w-64', 'w-72', 'w-80', 'w-96',
    'h-64',

    // Spacing (Margins & Padding)
    'm-0', 'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'm-8', 'm-10', 'm-12', 'mt-0', 'mt-1', 'mt-2', 'mt-3', 'mt-4', 'mt-5', 'mt-6', 'mt-8', 'mt-10', 'mt-12', 'mb-0', 'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-5', 'mb-6', 'mb-8', 'mb-10', 'mb-12',
    'p-0', 'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8', 'p-10', 'p-12', 'p-16', 'pt-0', 'pt-1', 'pt-2', 'pt-3', 'pt-4', 'pt-5', 'pt-6', 'pt-8', 'pt-10', 'pt-12', 'pb-0', 'pb-1', 'pb-2', 'pb-3', 'pb-4', 'pb-5', 'pb-6', 'pb-8', 'pb-10', 'pb-12',
    'px-2', 'px-4', 'px-6', 'py-1', 'py-3', 'py-4', 'py-5', 'py-16', 'py-20', 'pr-8',
    'space-y-3', 'space-y-4', 'space-y-6', 'space-y-8', 'space-y-10', 'space-y-12', 'space-x-4', 'gap-2', 'gap-3', 'gap-4', 'gap-6', 'gap-8', 'gap-10', 'gap-12',

    // Alignment
    'justify-start', 'justify-center', 'justify-end', 'justify-between', 'justify-around', 'justify-evenly',
    'items-start', 'items-center', 'items-end', 'items-baseline', 'items-stretch',

    // Responsive Grid
    'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-4',
    'md:flex-row', 'md:flex-col',

    // Typography
    'text-center', 'text-left', 'text-right',
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl',
    'md:text-5xl', 'md:text-6xl',
    'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold',
    'leading-none', 'leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed', 'leading-loose',

    // Specific & Interactive
    'hover:bg-white/10', 'hover:bg-black/5',
    'p-2.5'
];
