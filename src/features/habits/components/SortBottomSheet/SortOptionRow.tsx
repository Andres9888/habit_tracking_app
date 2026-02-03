import { Check } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

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
 *
 * Design specs:
 * - Icon container: 40x40, rounded-xl, gradient background
 * - Title: 15px, font-medium
 * - Description: 12px, text-stone-500
 * - Selected state: bg-amber-50, border-amber-100, checkmark icon
 */
export function SortOptionRow({
  Icon,
  iconBgColors,
  title,
  description,
  selected,
  onPress,
}: SortOptionRowProps) {
  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      accessibilityLabel={`${title}. ${description}`}
      accessibilityRole='radio'
      accessibilityState={{ checked: selected }}
      className={`flex-row items-center gap-3 rounded-xl px-3 py-3 ${
        selected ? 'border border-amber-100 bg-amber-50' : 'active:bg-stone-50'
      }`}
      onPress={handlePress}
    >
      {/* Icon container with gradient */}
      <LinearGradient
        className='h-10 w-10 items-center justify-center rounded-xl'
        colors={iconBgColors}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      >
        <Icon color='#ffffff' size={20} strokeWidth={2.25} />
      </LinearGradient>

      {/* Text content */}
      <View className='flex-1'>
        <Text className='text-[15px] font-medium text-stone-800'>{title}</Text>
        <Text className='text-[13px] font-normal text-stone-500'>
          {description}
        </Text>
      </View>

      {/* Checkmark for selected state */}
      {selected && (
        <View className='h-6 w-6 items-center justify-center rounded-full bg-amber-500'>
          <Check color='#ffffff' size={14} strokeWidth={2.5} />
        </View>
      )}
    </Pressable>
  );
}

export default SortOptionRow;
