/** StatsNotesHeader - Header + tabs for StatsNotesModal (theme-aware) */

import { Pressable, Text, View } from 'react-native';

import Animated, { FadeInDown } from 'react-native-reanimated';

import { ModalCloseButton } from '../ui/ModalCloseButton';
import { useThemeColors } from '../../theme/ThemeContext';

const anim = (delay: number) =>
  FadeInDown.duration(280).delay(delay).springify().damping(18);

interface Props {
  activeTab: 'stats' | 'notes';
  onClose: () => void;
  onTabChange: (tab: 'stats' | 'notes') => void;
}

export function StatsNotesHeader({ activeTab, onClose, onTabChange }: Props) {
  const { colors } = useThemeColors();

  return (
    <>
      <Animated.View
        className='flex-row items-center justify-between px-5 py-4'
        entering={anim(0)}
        style={{ borderBottomWidth: 1, borderBottomColor: colors.cardBorder }}
      >
        <Text
          className='font-bold'
          style={{ fontSize: 22, letterSpacing: -0.35, color: colors.text.primary }}
        >
          Stats & Notes
        </Text>
        <ModalCloseButton label='Close stats and notes' onClose={onClose} />
      </Animated.View>
      <Animated.View
        className='flex-row'
        entering={anim(60)}
        style={{ borderBottomWidth: 1, borderBottomColor: colors.cardBorder }}
      >
        {(['stats', 'notes'] as const).map((tab) => (
          <Pressable
            key={tab}
            accessibilityLabel={`${tab} tab`}
            accessibilityRole='tab'
            accessibilityState={{ selected: activeTab === tab }}
            className='flex-1 items-center py-3'
            style={activeTab === tab ? { borderBottomWidth: 2, borderBottomColor: '#047857' } : undefined}
            onPress={() => onTabChange(tab)}
          >
            <Text
              className='font-semibold'
              style={{
                color: activeTab === tab ? '#047857' : colors.text.secondary,
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
