import { Lock } from 'lucide-react-native';
import { Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights } from '@/theme/typography';
import { AnimatedPressable } from '../../ui';

export function LimitReachedResume({
  onUpgradePress,
}: {
  onUpgradePress?: () => void;
}) {
  const { colors: c } = useThemeColors();
  const bg = c.gray[200];
  const fg = c.text.tertiary;
  return (
    <AnimatedPressable
      accessibilityLabel='Upgrade to resume this habit'
      accessibilityRole='button'
      className='mt-3 flex-row items-center justify-center gap-2 self-start'
      style={{
        height: 34,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: bg,
      }}
      onPress={onUpgradePress}
    >
      <Lock color={fg} size={15} strokeWidth={2.5} />
      <Text
        style={{
          fontSize: 14,
          fontWeight: fontWeights.semibold,
          color: fg,
          letterSpacing: -0.1,
        }}
      >
        Upgrade to restore
      </Text>
    </AnimatedPressable>
  );
}
