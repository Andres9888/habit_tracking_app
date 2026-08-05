import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { HabitSlot } from '../components/HabitSlot';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { StepComponentProps } from '../types';

const SLOTS = [
  { index: 1, label: '10-minute walk', locked: false },
  { index: 2, label: 'Meditation', locked: false },
  { index: 3, label: 'Read 10 pages', locked: false },
  { index: 4, label: 'unlocks once routes hold', locked: true },
  { index: 5, label: 'unlocks once routes hold', locked: true },
];

export function ThreeDeepStep({ onNext }: StepComponentProps) {
  const { colors } = useThemeColors();

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', paddingTop: 8 }}>
      <View>
        <Text
          accessibilityRole="header"
          style={{
            color: colors.text.primary,
            fontSize: 40,
            fontWeight: '800',
            letterSpacing: -1.2,
            lineHeight: 44,
          }}
        >
          You&rsquo;ll finish{'\n'}what you started.
        </Text>
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: 15,
            lineHeight: 22,
            marginTop: 12,
          }}
        >
          Three routes at a time. New slots unlock once routes are holding. Most apps let you stack ten and burn out by week three.
        </Text>
        <View style={{ marginTop: 20 }}>
          {SLOTS.map((slot) => (
            <HabitSlot
              index={slot.index}
              key={slot.index}
              label={slot.label}
              locked={slot.locked}
            />
          ))}
        </View>
      </View>
      <PrimaryCTA label="Continue" onPress={onNext} variant="brand" />
    </View>
  );
}
