/** StatsNotesHeader - Header + tabs for StatsNotesModal */
import { Pressable, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/colors';

const anim = (delay: number) =>
  FadeInDown.duration(280).delay(delay).springify().damping(18);

interface Props {
  activeTab: 'stats' | 'notes';
  onClose: () => void;
  onTabChange: (tab: 'stats' | 'notes') => void;
}

export function StatsNotesHeader({ activeTab, onClose, onTabChange }: Props) {
  return (
    <>
      <Animated.View
        className='flex-row items-center justify-between border-b border-stone-200 px-5 py-4'
        entering={anim(0)}
      >
        <Text
          className='font-bold text-stone-900'
          style={{ fontSize: 22, letterSpacing: -0.35 }}
        >
          Stats & Notes
        </Text>
        <Pressable
          accessibilityLabel='Close stats and notes'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200'
          onPress={onClose}
        >
          <X color={colors.gray[500]} size={24} strokeWidth={2} />
        </Pressable>
      </Animated.View>
      <Animated.View
        className='flex-row border-b border-stone-200'
        entering={anim(60)}
      >
        {(['stats', 'notes'] as const).map((tab) => (
          <Pressable
            key={tab}
            accessibilityLabel={`${tab} tab`}
            accessibilityRole='tab'
            accessibilityState={{ selected: activeTab === tab }}
            className={`flex-1 items-center py-3 ${activeTab === tab ? 'border-b-2 border-emerald-700' : ''}`}
            onPress={() => onTabChange(tab)}
          >
            <Text
              className='font-semibold'
              style={{
                color: activeTab === tab ? '#047857' : '#78716c',
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
