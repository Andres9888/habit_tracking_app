/**
 * Deterministic template slug from a template name, for building share links
 * (chainday.app/library/<slug>). Mirror of convex/templates/slug.ts — keep in
 * sync so a generated link resolves back via api.templates.getBySlug.
 */

export function toTemplateSlug(name: string): string {
  return name
    .normalize('NFD')
    .replaceAll(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '');
}

export const LIBRARY_SHARE_BASE = 'https://chainday.app/library';

export function templateShareUrl(name: string): string {
  return `${LIBRARY_SHARE_BASE}/${toTemplateSlug(name)}`;
}
