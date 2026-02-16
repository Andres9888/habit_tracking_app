import { layoutStyles } from './layout.styles';
import { statsStyles } from './stats.styles';
import { useControlsStyles } from './controls.styles';

export function useStyles() {
  const controlsStyles = useControlsStyles();
  return {
    ...layoutStyles,
    ...statsStyles,
    ...controlsStyles,
  };
}

/** @deprecated Use useStyles() for dark mode support */
export const styles = {} as ReturnType<typeof useStyles>;
