import data from './site.json';
export type Section = { id?: string; label: string; title: string; body: string; kind: string; image?: string; aside?: string; cards?: { title: string; body: string }[]; link?: {label: string; href: string; external?: boolean} };
export type PageContent = { path: string; title: string; description: string; eyebrow: string; headline: string; intro: string; heroVisual: boolean; heroAnchors?: string[][]; sections: Section[]; faqs: string[][] };
export const content = data;
export const pages: Record<string, PageContent> = data.pages;
