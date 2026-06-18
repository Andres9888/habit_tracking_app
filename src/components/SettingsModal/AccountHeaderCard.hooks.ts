/** useAccountHeader — name/avatar glue for AccountHeaderCard */
import { useThemeColors } from '../../theme/ThemeContext';
import { useProfileDisplayName } from './useProfileDisplayName';
import { useProfileDisplayImage } from './useProfileDisplayImage';

export function useAccountHeader() {
  const { colors, isDark } = useThemeColors();
  const { initial, name } = useProfileDisplayName();
  const { imageUrl } = useProfileDisplayImage();
  return { themeColors: colors, isDark, name, imageUrl, initial };
}
