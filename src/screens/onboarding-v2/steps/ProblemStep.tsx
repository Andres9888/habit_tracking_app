import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { StepComponentProps } from '../types';

export function ProblemStep({ onNext }: StepComponentProps) {
  const { colors } = useThemeColors();

  return (
    <Pressable accessibilityRole="button" onPress={onNext} style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'space-between', paddingTop: 24 }}>
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Text
              style={{
                color: colors.text.tertiary,
                fontSize: 14,
                fontWeight: '500',
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              Streak
            </Text>
            <View style={{ alignItems: 'center', marginTop: 8, position: 'relative' }}>
              <Text
                style={{
                  color: '#C0392B',
                  fontSize: 96,
                  fontWeight: '800',
                  letterSpacing: -4,
                  lineHeight: 100,
                  opacity: 0.45,
                }}
              >
                42
              </Text>
              <View
                style={{
                  backgroundColor: '#C0392B',
                  borderRadius: 2,
                  height: 4,
                  position: 'absolute',
                  top: '50%',
                  transform: [{ rotate: '-15deg' }],
                  width: '120%',
                }}
              />
            </View>
          </View>
          <Text
            accessibilityRole="header"
            style={{
              color: colors.text.primary,
              fontSize: 40,
              fontWeight: '800',
              letterSpacing: -1.5,
              lineHeight: 44,
              textAlign: 'center',
            }}
          >
            Miss a day.{'\n'}Lose everything.{'\n'}Quit.
          </Text>
          <Text
            style={{
              color: colors.text.secondary,
              fontSize: 16,
              lineHeight: 22,
              marginTop: 20,
              maxWidth: 300,
              textAlign: 'center',
            }}
          >
            That&rsquo;s how every other habit app works.
          </Text>
        </View>
        <View style={{ alignItems: 'center', paddingBottom: 16 }}>
          <Text
            style={{
              color: colors.text.tertiary,
              fontSize: 13,
              fontWeight: '500',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            Tap to continue
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
