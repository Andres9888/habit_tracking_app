/**
 * Styles barrel export for FullsizeTemplatePreview
 */

export { layoutStyles, createLayoutStyles } from './layout.styles';
export { heroStyles, createHeroStyles } from './hero.styles';
export { scienceStyles, createScienceStyles } from './science.styles';
export { tipsStyles, createTipsStyles } from './tips.styles';
export { footerStyles, createFooterStyles } from './footer.styles';

import type { SemanticColors } from '../../../../theme/darkColors';
import { createLayoutStyles } from './layout.styles';
import { createHeroStyles } from './hero.styles';
import { createScienceStyles } from './science.styles';
import { createTipsStyles } from './tips.styles';
import { createFooterStyles } from './footer.styles';

/** Create all FullsizeTemplatePreview styles with theme colors */
export function createFullsizeTemplatePreviewStyles(tc: SemanticColors) {
  return {
    ...createLayoutStyles(tc),
    ...createHeroStyles(tc),
    ...createScienceStyles(tc),
    ...createTipsStyles(tc),
    ...createFooterStyles(tc),
  };
}
