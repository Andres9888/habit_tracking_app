import { triggerHaptic } from '@/utils/haptics';
import { Check } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface SortOptionRowProps {
  /**
   * Lucide icon component to display
   */
  Icon: LucideIcon;
  /**
   * Gradient colors for the icon background [start, end]
   */
  iconBgColors: [string, string];
  /**
   * Main title text
   */
  title: string;
  /**
   * Description text below the title
   */
  description: string;
  /**
   * Whether this option is currently selected
   */
  selected: boolean;
  /**
   * Callback when this option is pressed
   */
  onPress: () => void;
}

/**
 * SortOptionRow - A single sort option in the detailed options list.
 */
export function SortOptionRow({
  Icon,
  iconBgColors,
  title,
  description,
  selected,
  onPress,
}: SortOptionRowProps) {
  const { colors: themeColors, isDark } = useThemeColors();

  const handlePress = () => {
    triggerHaptic('tap');
    onPress();
  };

  return (
    <Pressable
      accessibilityHint={`Select ${title} sort option`}
      accessibilityLabel={`${title}. ${description}`}
      accessibilityRole='radio'
      accessibilityState={{ checked: selected }}
      className='mb-1 flex-row items-center gap-3 rounded-xl px-3 py-3'
      style={{
        backgroundColor: selected
          ? isDark
            ? '#1f2937'
            : '#ecfdf5'
          : 'transparent',
        borderColor: selected ? themeColors.primary[300] : 'transparent',
        borderWidth: selected ? 1 : 0,
      }}
      onPress={handlePress}
    >
      <LinearGradient
        className='h-10 w-10 items-center justify-center rounded-xl'
        colors={iconBgColors}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      >
        <Icon color='#ffffff' size={20} strokeWidth={2.25} />
      </LinearGradient>

      <View className='flex-1'>
        <Text
          className='text-[15px] font-medium'
          style={{ color: themeColors.text.primary }}
        >
          {title}
        </Text>
        <Text
          className='text-[13px] font-normal'
          style={{ color: themeColors.text.secondary }}
        >
          {description}
        </Text>
      </View>

      {selected && (
        <View
          className='h-6 w-6 items-center justify-center rounded-full'
          style={{ backgroundColor: themeColors.primary[500] }}
        >
          <Check color='#ffffff' size={14} strokeWidth={2.5} />
        </View>
      )}
    </Pressable>
  );
}

export default SortOptionRow;
