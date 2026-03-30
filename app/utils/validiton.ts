import { z } from 'zod';

const localizedString = z.object({
    en: z.string().optional().or(z.literal("")),
    ar: z.string().optional().or(z.literal("")),
}).refine(data => data.en || data.ar, {
    message: "At least one translation (AR or EN) is required"
});

export const createPageSchema = z.object({
    title: localizedString,
    url: z.string().min(1),
    content: z.any().optional(), // Json object
    websiteId: z.string().min(1),
    userId: z.number().optional(),
});

export const updatePageSchema = z.object({
    title: localizedString.optional(),
    url: z.string().min(1).optional(),
    content: z.any().optional(), // Json object
    isPublished: z.boolean().optional(),
    websiteId: z.string().optional(),
    userId: z.number().optional(),
});

export const createFooterSchema = z.object({
    title: localizedString,
    content: z.any().optional(), // Json object
    websiteId: z.string().min(1),
    userId: z.number().optional(),
});

export const updateFooterSchema = z.object({
    title: localizedString.optional(),
    content: z.any().optional(), // Json object
    isPublished: z.boolean().optional(),
    websiteId: z.string().optional(),
    userId: z.number().optional(),
});

export const createUserSchema = z.object({
    email: z.string().email({ message: 'invalidEmail' }).optional(),
    phone: z.string().optional(),
    name: z.string().optional(),
    password: z.string().min(6, { message: 'passwordTooShort' }).optional(),
    role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).optional(),
}).refine(data => data.email || data.phone, {
    message: "Either email or phone is required"
});

export const updateUserSchema = z.object({
    email: z.string().email({ message: 'invalidEmail' }).optional(),
    name: z.string().optional(),
    password: z.string().min(6, { message: 'passwordTooShort' }).optional(),
    role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).optional(),
});

export const createSocialMediaSchema = z.object({
    name: localizedString.optional(),
    url: z.string().min(1),
    image: z.string().optional(),
});

export const updateSocialMediaSchema = z.object({
    name: localizedString.optional(),
    url: z.string().min(1).optional(),
    image: z.string().optional(),
});

export const createWebsiteSchema = z.object({
    name: localizedString,
    domain: z.string().optional(),
    themeColor: z.string().optional(),
    fontFamily: z.string().optional(),
    language: z.string().optional(),
    logo: z.string().optional(),
});

export const updateWebsiteSchema = z.object({
    name: localizedString.optional(),
    domain: z.string().optional(),
    themeColor: z.string().optional(),
    fontFamily: z.string().optional(),
    language: z.string().optional(),
    logo: z.string().optional(),
});

export const createMenuSchema = z.object({
    name: localizedString,
    url: z.string().min(1),
    pageId: z.string().optional(),
    sequence: z.number().optional(),
    parentId: z.string().optional(),
    websiteId: z.string().min(1),
});

export const updateMenuSchema = z.object({
    name: localizedString.optional(),
    url: z.string().min(1).optional(),
    pageId: z.string().optional(),
    sequence: z.number().optional(),
    parentId: z.string().optional(),
    websiteId: z.string().min(1).optional(),
});

export const createSnippetSchema = z.object({
    name: z.string().min(1, { message: 'snippetNameRequired' }),
    nameAr: z.string().optional(),
    category: z.string().min(1),
    htmlContent: z.string().min(1),
    thumbnail: z.string().optional(),
    type: z.enum(['STATIC', 'DYNAMIC']).optional(),
    apiEndpoint: z.string().optional().nullable().or(z.literal("")),
    swiperConfig: z.any().optional(),
    fieldMapping: z.any().optional(),
    categoryId: z.string().optional().nullable(),
});

export const updateSnippetSchema = z.object({
    name: z.string().min(1, { message: 'snippetNameRequired' }).optional(),
    nameAr: z.string().optional(),
    category: z.string().min(1).optional(),
    htmlContent: z.string().min(1).optional(),
    thumbnail: z.string().optional(),
    type: z.enum(['STATIC', 'DYNAMIC']).optional(),
    apiEndpoint: z.string().optional().nullable().or(z.literal("")),
    swiperConfig: z.any().optional(),
    fieldMapping: z.any().optional(),
    categoryId: z.string().optional().nullable(),
});

export const createContentCategorySchema = z.object({
    name: z.string().min(1),
    nameAr: z.string().optional(),
});

export const updateContentCategorySchema = z.object({
    name: z.string().min(1).optional(),
    nameAr: z.string().optional(),
});

export const createDynamicContentSchema = z.object({
    title: z.string().min(1),
    titleAr: z.string().optional(),
    description: z.string().optional(),
    descriptionAr: z.string().optional(),
    image: z.string().optional(),
    images: z.array(z.string()).optional(),
    categoryId: z.string().min(1),
    publishDate: z.coerce.date().optional(),
});

export const updateDynamicContentSchema = z.object({
    title: z.string().min(1).optional(),
    titleAr: z.string().optional(),
    description: z.string().optional(),
    descriptionAr: z.string().optional(),
    image: z.string().optional(),
    images: z.array(z.string()).optional(),
    categoryId: z.string().optional(),
    publishDate: z.coerce.date().optional(),
});
