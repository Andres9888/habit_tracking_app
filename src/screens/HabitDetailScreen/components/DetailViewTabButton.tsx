/**
 * DetailViewTabButton - Individual tab button for Calendar/Strength toggle.
 * Renders icon + label + optional hint with active/inactive styling.
 */

import { Pressable, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useThemeColors } from '@/theme';

export type DetailView = 'calendar' | 'strength';

interface DetailViewTabButtonProps {
  accentColor: string;
  activeView: DetailView;
  hint?: string;
  icon: LucideIcon;
  label: string;
  view: DetailView;
  onPress: (view: DetailView) => void;
}

export function DetailViewTabButton({
  accentColor,
  activeView,
  hint,
  icon: Icon,
  label,
  view,
  onPress,
}: DetailViewTabButtonProps) {
  const { colors, isDark } = useThemeColors();
  const isActive = activeView === view;
  const foreground = isActive ? accentColor : colors.text.tertiary;
  const hintBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <Pressable
      accessibilityRole='tab'
      accessibilityState={{ selected: isActive }}
      className='flex-1 flex-row items-center justify-center gap-1.5 py-2.5'
      onPress={() => onPress(view)}
    >
      <Icon
        color={foreground}
        size={16}
        strokeWidth={isActive ? 2.5 : 2}
      />
      <Text
        className='text-[13px]'
        style={{
          color: foreground,
          fontWeight: isActive ? '600' : '500',
        }}
      >
        {label}
      </Text>
      {hint ? (
        <View
          className='ml-0.5 rounded-full px-1.5 py-0.5'
          style={{ backgroundColor: hintBg }}
        >
          <Text
            className='text-[12px] font-medium'
            style={{ color: foreground }}
          >
            {hint}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}
