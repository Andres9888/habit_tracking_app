/** AlgorithmCard — Labeled algorithm option with icon, description, and formation-time chip. */
import { Clock } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { triggerHaptic } from '@/utils/haptics';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import type { AlgorithmCopyEntry } from './algorithmCopy';

interface AlgorithmCardProps {
  entry: AlgorithmCopyEntry;
  selected: boolean;
  showDefaultPill?: boolean;
  /** Omit to render a non-interactive legend card. */
  onPress?: () => void;
}

export function AlgorithmCard({
  entry,
  selected,
  showDefaultPill = false,
  onPress,
}: AlgorithmCardProps) {
  const { colors, isDark } = useThemeColors();
  const accent = colors.primary[700];
  const selectedBg = isDark ? 'rgba(52,211,153,0.10)' : 'rgba(5,150,105,0.08)';
  const borderColor = selected ? accent : colors.border;
  const iconTint = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';

  const handlePress = () => {
    if (!onPress) return;
    if (!selected) void triggerHaptic('selection');
    onPress();
  };

  return (
    <Pressable
      accessibilityLabel={entry.name}
      accessibilityRole={onPress ? 'radio' : 'none'}
      accessibilityState={{ selected, disabled: !onPress }}
      className='mb-2 flex-row gap-3 rounded-xl p-3'
      disabled={!onPress}
      style={{
        borderWidth: 1.5,
        borderColor,
        backgroundColor: selected ? selectedBg : colors.card,
      }}
      onPress={handlePress}
    >
      <View
        className='h-9 w-9 items-center justify-center rounded-xl'
        style={{ backgroundColor: iconTint }}
      >
        <entry.Icon color={accent} size={iconSizes.small} strokeWidth={2} />
      </View>
      <View className='flex-1'>
        <View className='flex-row items-center gap-2'>
          <Text
            className='text-sm font-bold'
            style={{ color: colors.text.primary }}
          >
            {entry.name}
          </Text>
          {showDefaultPill ? (
            <View
              className='rounded px-1.5 py-0.5'
              style={{ backgroundColor: accent }}
            >
              <Text className='text-[9px] font-bold text-white'>DEFAULT</Text>
            </View>
          ) : null}
        </View>
        <Text
          className='mt-0.5 text-xs leading-[1.4]'
          style={{ color: colors.text.secondary }}
        >
          {entry.examples ? `${entry.examples} ` : ''}
          {entry.description}
        </Text>
        <View
          className='mt-1.5 flex-row items-center gap-1 self-start rounded-md px-2 py-0.5'
          style={{ backgroundColor: iconTint }}
        >
          <Clock color={colors.text.secondary} size={iconSizes.micro} strokeWidth={2} />
          <Text
            className='text-xs font-semibold'
            style={{ color: colors.text.secondary }}
          >
            ~{entry.daysToForm} days to automatic
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
