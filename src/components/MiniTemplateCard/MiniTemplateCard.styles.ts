/**
 * Styles for MiniTemplateCard component
 */

import { useCardStyles } from './styles/cardStyles';
import { useImportButtonStyles } from './styles/importButtonStyles';
import { headerStyles } from './styles/headerStyles';

export function useStyles() {
  const cardStyles = useCardStyles();
  const importButtonStyles = useImportButtonStyles();

  return {
    ...cardStyles,
    ...importButtonStyles,
    ...headerStyles,
  };
}

/** @deprecated Use useStyles() for dark mode support */
export { useStyles as styles };
