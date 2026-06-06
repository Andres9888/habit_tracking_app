/** Title row for AdvancedOptionRow with optional info affordance. */
import { Pressable, Text, View } from 'react-native';
import { Info } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';

interface Props {
  title: string;
  onInfoPress?: () => void;
}

export function AdvancedOptionRowTitle({ title, onInfoPress }: Props) {
  const { colors } = useThemeColors();

  const handleInfoPress = () => {
    void Haptics.selectionAsync();
    onInfoPress?.();
  };

  return (
    <View className='flex-row items-center gap-1.5'>
      <Text
        style={{
          ...typography.body,
          fontWeight: fontWeights.semibold,
          color: colors.text.primary,
        }}
      >
        {title}
      </Text>
      {onInfoPress ? (
        <Pressable
          accessibilityHint='Opens explanation of this option'
          accessibilityLabel={`About ${title}`}
          accessibilityRole='button'
          hitSlop={8}
          onPress={handleInfoPress}
        >
          <Info color={colors.text.tertiary} size={iconSizes.small} />
        </Pressable>
      ) : null}
    </View>
  );
}
