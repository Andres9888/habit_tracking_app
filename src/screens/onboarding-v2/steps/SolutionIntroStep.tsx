import { Image, Pressable, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import CHAIN_ICON from '../../../assets/onboarding/chainday-welcome-icon.png';

import { StepComponentProps } from '../types';

const ICON_SIZE = 96;

export function SolutionIntroStep({ onNext }: StepComponentProps) {
  const { colors } = useThemeColors();

  return (
    <Pressable accessibilityRole="button" onPress={onNext} style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'space-between', paddingTop: 24 }}>
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <Image
            accessibilityLabel="ChainDay icon"
            accessibilityRole="image"
            source={CHAIN_ICON as ImageSourcePropType}
            style={{
              borderRadius: 20,
              height: ICON_SIZE,
              marginBottom: 36,
              shadowColor: colors.gray[900],
              shadowOffset: { height: 6, width: 0 },
              shadowOpacity: 0.12,
              shadowRadius: 18,
              width: ICON_SIZE,
            }}
          />
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
            Watch a habit{'\n'}become you.
          </Text>
          <Text
            style={{
              color: colors.text.secondary,
              fontSize: 16,
              lineHeight: 22,
              marginTop: 20,
              maxWidth: 320,
              textAlign: 'center',
            }}
          >
            Miss a day, the chain shows it. But your strength holds. Your tier holds. You don&rsquo;t start over.
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
