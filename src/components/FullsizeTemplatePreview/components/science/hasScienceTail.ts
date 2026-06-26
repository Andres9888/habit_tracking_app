/**
 * Whether a template has deeper science worth hiding behind "See the full
 * science" (SPEC_02). Keyed on the *optional* drill-down fields only — NOT the
 * required `scientificReference` — so a description-only template reports no
 * tail and shows just the head (SPEC_04 graceful fallback).
 */

import type { Template } from '../../../../types/template';

export function hasScienceTail(template: Template): boolean {
  return Boolean(
    template?.evidence ||
      template?.youtubeLink ||
      template?.timeline?.length ||
      template?.howToStart?.length ||
      template?.sources?.length
  );
}
