/** More themes disclosure toggle for Growth Icons. */
import { Pressable, Text } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontFamilies, fontWeights } from '@/theme/typography';
import { usePressed } from './usePressed';

interface ToggleProps {
  open: boolean;
  onToggle: () => void;
}

function ToggleChevron({ open }: { open: boolean }) {
  const { colors } = useThemeColors();
  const Icon = open ? ChevronUp : ChevronDown;
  const color = open ? colors.text.secondary : colors.primary[700];
  return <Icon color={color} size={iconSizes.small} strokeWidth={2.5} />;
}

export function GrowthIconsMoreToggle({ open, onToggle }: ToggleProps) {
  const { colors } = useThemeColors();
  const { pressed, pressProps } = usePressed();
  return (
    <Pressable
      accessibilityRole='button'
      accessibilityState={{ expanded: open }}
      {...pressProps}
      style={{
        marginTop: 8,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        minHeight: 36,
        paddingHorizontal: 4,
        borderRadius: 10,
        backgroundColor: pressed ? colors.primary[100] : 'transparent',
      }}
      onPress={onToggle}
    >
      <ToggleChevron open={open} />
      <Text
        style={{
          fontFamily: fontFamilies.primary.text,
          fontSize: 12,
          fontWeight: fontWeights.bold,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          color: open ? colors.text.secondary : colors.primary[700],
        }}
      >
        {open ? 'Less themes' : 'More themes'}
      </Text>
    </Pressable>
  );
}
