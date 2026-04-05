/**
 * Scroll shadow overlays for list views
 */

import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronDown } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../../templates/templatesScreenStyles';
import { iconSizes } from '@/theme/iconSizes';

interface ScrollShadowsProps {
  showBottomShadow: boolean;
  showTopShadow: boolean;
}

export function ScrollShadows({
  showBottomShadow,
  showTopShadow,
}: ScrollShadowsProps) {
  const { colors, isDark } = useThemeColors();
  const bgOpaque = isDark
    ? 'rgba(17,24,39,0.96)'
    : 'rgba(248,247,245,0.96)';
  const bgTransparent = isDark
    ? 'rgba(17,24,39,0)'
    : 'rgba(248,247,245,0)';
  const chipBg = isDark
    ? 'rgba(31,41,55,0.9)'
    : 'rgba(255,255,255,0.9)';

  return (
    <>
      {showTopShadow ? <LinearGradient
          colors={[bgOpaque, bgTransparent]}
          pointerEvents='none'
          style={styles.scrollFadeTop}
        /> : null}
      {showBottomShadow ? <LinearGradient
          colors={[bgTransparent, bgOpaque]}
          pointerEvents='none'
          style={styles.scrollFadeBottom}
        >
          <View
            style={[
              styles.scrollHintChip,
              { backgroundColor: chipBg },
            ]}
          >
            <ChevronDown
              color={colors.text.secondary}
              size={iconSizes.small}
              strokeWidth={2.5}
            />
            <Text
              style={[
                styles.scrollHintText,
                { color: colors.text.secondary },
              ]}
            >
              Scroll for more
            </Text>
          </View>
        </LinearGradient> : null}
    </>
  );
}
