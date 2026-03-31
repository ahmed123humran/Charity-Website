// This file exists solely to tell Tailwind's JIT (Just-In-Time) compiler to generate these classes.
// Since snippets are loaded from the database dynamically, Tailwind cannot "see" their classes during build time.
// By listing them here, we guarantee they are always compiled and available for the Website Builder.

export const dynamicTailwindSafelist = [
    // Primary Colors
    'bg-primary', 'text-primary', 'border-primary', 'from-primary', 'to-primary', 'ring-primary', 'fill-primary',

    // Primary Opacities
    'bg-primary/5', 'bg-primary/10', 'bg-primary/20', 'bg-primary/50',

    // Primary Hover States
    'hover:bg-primary', 'hover:text-primary',
    'group-hover:bg-primary/10', 'group-hover:bg-primary/20', 'group-hover:text-primary',

    // Secondary Colors
    'bg-secondary', 'text-secondary', 'border-secondary', 'from-secondary', 'to-secondary', 'ring-secondary', 'fill-secondary',

    // Secondary Opacities
    'bg-secondary/5', 'bg-secondary/10', 'bg-secondary/20', 'bg-secondary/50',

    // Secondary Hover States
    'hover:bg-secondary', 'hover:text-secondary',
    'group-hover:bg-secondary/10', 'group-hover:bg-secondary/20', 'group-hover:text-secondary',
];
