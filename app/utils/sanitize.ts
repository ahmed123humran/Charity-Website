import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Allows safe HTML elements (formatting, images, links, videos, iframes)
 * while removing dangerous elements (script, event handlers, javascript: URLs).
 */
export function sanitizeHtml(html: string): string {
    if (!html) return '';

    return DOMPurify.sanitize(html, {
        // Allow iframes for embedded videos (YouTube, Vimeo, etc.)
        ADD_TAGS: ['iframe'],
        // Explicitly allow data URIs for media
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        ADD_ATTR: [
            'allow',
            'allowfullscreen',
            'frameborder',
            'scrolling',
            'target',
            'loading',
            // SVG attributes
            'viewBox',
            'fill',
            'stroke',
            'stroke-width',
            'stroke-linecap',
            'stroke-linejoin',
            'd',
            'cx',
            'cy',
            'r',
            'rx',
            'ry',
            'x',
            'y',
            'x1',
            'y1',
            'x2',
            'y2',
            'points',
            'transform',
            'xmlns',
        ],
        // Allow style attributes for Tailwind inline styles
        ALLOW_DATA_ATTR: true,
        // Allow class attributes for Tailwind CSS
        ALLOWED_ATTR: [
            'class',
            'style',
            'id',
            'href',
            'src',
            'alt',
            'title',
            'width',
            'height',
            'controls',
            'autoplay',
            'loop',
            'muted',
            'poster',
            'preload',
            'type',
            'value',
            'name',
            'placeholder',
            'dir',
            'lang',
            'colspan',
            'rowspan',
            'aria-*',
            'role',
            'tabindex',
            'data-*',
            // Already added via ADD_ATTR but being explicit
            'target',
            'loading',
            'allow',
            'allowfullscreen',
            'frameborder',
            'scrolling',
            // SVG
            'viewBox',
            'fill',
            'stroke',
            'stroke-width',
            'stroke-linecap',
            'stroke-linejoin',
            'd',
            'cx',
            'cy',
            'r',
            'rx',
            'ry',
            'x',
            'y',
            'x1',
            'y1',
            'x2',
            'y2',
            'points',
            'transform',
            'xmlns',
        ],
    });
}
