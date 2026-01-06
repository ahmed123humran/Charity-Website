export type CreatePageDto = {
    title: string;
    url: string;
    content?: string;
    websiteId: string;
    userId?: number;
};

export type UpdatePageDto = {
    title?: string;
    url?: string;
    content?: string;
    isPublished?: boolean;
};

export type CreateUserDto = {
    email: string;
    name?: string;
    password?: string;
};

export type UpdateUserDto = {
    email?: string;
    name?: string;
    password?: string;
};

export type CreateWebsiteDto = {
    name: string;
    domain?: string;
    themeColor?: string;
    language?: string;
};

export type UpdateWebsiteDto = {
    name?: string;
    domain?: string;
    themeColor?: string;
    language?: string;
};

export type CreateMenuDto = {
    name: string;
    url: string;
    sequence?: number;
    parentId?: string;
    websiteId: string;
};

export type UpdateMenuDto = {
    name?: string;
    url?: string;
    sequence?: number;
    parentId?: string;
};

export type CreateSnippetDto = {
    name: string;
    category: string;
    htmlContent: string;
    thumbnail?: string;
};

export type UpdateSnippetDto = {
    name?: string;
    category?: string;
    htmlContent?: string;
    thumbnail?: string;
};