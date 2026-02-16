import { StyleSheet } from 'react-native';

import { useThemeColors } from '../../../theme/ThemeContext';

export function useControlsStyles() {
  const { colors } = useThemeColors();

  return StyleSheet.create({
    progressBar: {
      backgroundColor: colors.offline.accent,
      height: '100%',
    },
    progressContainer: {
      backgroundColor: colors.offline.trackBg,
      bottom: 0,
      height: 3,
      left: 0,
      position: 'absolute',
      right: 0,
    },
    subtitle: {
      color: colors.offline.subtitle,
      fontSize: 13,
      marginTop: 2,
    },
    syncButton: {
      alignItems: 'center',
      backgroundColor: colors.offline.accent,
      borderRadius: 16,
      flexDirection: 'row',
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    syncButtonText: {
      color: colors.text.inverse,
      fontSize: 13,
      fontWeight: '600',
      marginLeft: 4,
    },
    title: {
      color: colors.offline.title,
      fontSize: 17,
      fontWeight: '600',
    },
  });
}

/** @deprecated Use useControlsStyles() for dark mode support */
export const controlsStyles = {} as ReturnType<typeof useControlsStyles>;
