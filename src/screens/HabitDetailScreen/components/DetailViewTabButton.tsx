/**
 * DetailViewTabButton - Individual tab button for Calendar/Strength toggle.
 * Renders icon + label + optional hint with active/inactive styling.
 */

import { Pressable, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useThemeColors } from '@/theme';

export type DetailView = 'calendar' | 'strength';

interface DetailViewTabButtonProps {
  activeView: DetailView;
  hint?: string;
  icon: LucideIcon;
  label: string;
  view: DetailView;
  onPress: (view: DetailView) => void;
}

export function DetailViewTabButton({
  activeView,
  hint,
  icon: Icon,
  label,
  view,
  onPress,
}: DetailViewTabButtonProps) {
  const { colors } = useThemeColors();
  const isActive = activeView === view;

  return (
    <Pressable
      accessibilityRole='tab'
      accessibilityState={{ selected: isActive }}
      className='flex-1 flex-row items-center justify-center gap-1.5 py-2.5'
      onPress={() => onPress(view)}
    >
      <Icon
        color={isActive ? '#059669' : colors.text.tertiary}
        size={16}
        strokeWidth={isActive ? 2.5 : 2}
      />
      <Text
        className='text-[13px]'
        style={{
          color: isActive ? '#059669' : colors.text.tertiary,
          fontWeight: isActive ? '600' : '500',
        }}
      >
        {label}
      </Text>
      {hint ? (
        <View className='ml-0.5 rounded-full bg-stone-200/60 px-1.5 py-0.5'>
          <Text
            className='text-[10px] font-medium'
            style={{ color: isActive ? '#059669' : colors.text.tertiary }}
          >
            {hint}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}
