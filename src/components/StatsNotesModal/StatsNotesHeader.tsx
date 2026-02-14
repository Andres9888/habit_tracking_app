/** StatsNotesHeader - Header + tabs for StatsNotesModal */
import { Pressable, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';

const anim = (delay: number) =>
  FadeInDown.duration(280).delay(delay).springify().damping(18);

interface Props {
  activeTab: 'stats' | 'notes';
  onClose: () => void;
  onTabChange: (tab: 'stats' | 'notes') => void;
}

export function StatsNotesHeader({ activeTab, onClose, onTabChange }: Props) {
  const { colors: themeColors, isDark } = useThemeColors();

  return (
    <>
      <Animated.View
        className='flex-row items-center justify-between px-5 py-4'
        entering={anim(0)}
        style={{ borderBottomWidth: 1, borderBottomColor: themeColors.border }}
      >
        <Text
          className='font-bold'
          style={{ fontSize: 22, letterSpacing: -0.35, color: themeColors.text.primary }}
        >
          Stats & Notes
        </Text>
        <Pressable
          accessibilityLabel='Close stats and notes'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full active:opacity-70'
          style={{ backgroundColor: isDark ? '#374151' : '#f5f5f4' }}
          onPress={onClose}
        >
          <X color={themeColors.text.secondary} size={24} strokeWidth={2} />
        </Pressable>
      </Animated.View>
      <Animated.View
        className='flex-row'
        entering={anim(60)}
        style={{ borderBottomWidth: 1, borderBottomColor: themeColors.border }}
      >
        {(['stats', 'notes'] as const).map((tab) => (
          <Pressable
            key={tab}
            accessibilityLabel={`${tab} tab`}
            accessibilityRole='tab'
            accessibilityState={{ selected: activeTab === tab }}
            className='flex-1 items-center py-3'
            style={
              activeTab === tab
                ? { borderBottomWidth: 2, borderBottomColor: themeColors.primary[600] }
                : undefined
            }
            onPress={() => onTabChange(tab)}
          >
            <Text
              className='font-semibold'
              style={{
                color: activeTab === tab ? themeColors.primary[600] : themeColors.text.secondary,
                fontSize: 17,
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </Animated.View>
    </>
  );
}
