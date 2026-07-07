/**
 * Dark-aware pill/badge colors for template list cards.
 *
 * Consolidates the top-pick and popularity color logic that was previously
 * duplicated inline in TemplateListCard.tsx and CardFooterMeta.tsx. Theme-
 * coupled: dark values follow `colors.status.*`, light values are the original
 * static hexes. Zero rendered-value change. Modeled on getImportedStateColors.
 */
import type { SemanticColors } from '../../../theme/darkColors';

export function getTemplatePillColors(colors: SemanticColors, isDark: boolean) {
  return {
    topPick: {
      accentBorder: isDark ? colors.status.warning : '#FCD34D',
      badgeBg: isDark ? colors.status.warningLight : '#FBBF24',
      badgeBorder: isDark ? colors.status.warningText : '#F59E0B',
      badgeText: isDark ? colors.status.warningText : '#78350F',
    },
    popularity: {
      bg: isDark ? colors.status.streakLight : '#FFF7ED',
      border: isDark ? colors.status.streakText : '#FED7AA',
      text: isDark ? colors.status.streakText : '#C2410C',
    },
  };
}
