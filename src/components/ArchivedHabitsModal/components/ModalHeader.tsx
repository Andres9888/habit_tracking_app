import { Pressable, View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { ChevronLeft } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { durations, enterEasing } from '@/theme/animations';
import { useThemeColors } from '@/theme/ThemeContext';
import { typography, fontWeights } from '@/theme/typography';
import { SettingsCountBadge } from '../../SettingsModal/SettingsCountBadge';

const ENTERING = FadeInDown.duration(durations.enter).easing(enterEasing);

interface ModalHeaderProps {
  insets: EdgeInsets;
  habitCount: number;
  selectionMode: boolean;
  onBack: () => void;
  onSelectPress: () => void;
}

export function ModalHeader({
  insets,
  habitCount,
  selectionMode,
  onBack,
  onSelectPress,
}: ModalHeaderProps) {
  const { colors, isDark } = useThemeColors();

  const subtitle =
    habitCount === 0
      ? 'No archived habits'
      : `habit${habitCount === 1 ? '' : 's'} archived · tap Resume to bring ${habitCount === 1 ? 'it' : 'them'} back`;

  const selectDisabled = !selectionMode && habitCount === 0;
  const selectLabel = selectionMode ? 'Cancel' : 'Select';
  const selectColor = selectionMode
    ? colors.text.secondary
    : colors.status.success;

  return (
    <Animated.View entering={ENTERING}>
      <BlurView
        intensity={20}
        style={{ paddingBottom: 8, paddingTop: insets.top + 8 }}
        tint={isDark ? 'dark' : 'light'}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            marginBottom: 16,
          }}
        >
          <Pressable
            accessibilityLabel='Back to settings'
            accessibilityRole='button'
            style={{
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.5,
            }}
            onPress={onBack}
          >
            <ChevronLeft
              color={colors.text.primary}
              size={iconSizes.large}
              strokeWidth={2}
            />
          </Pressable>
          <Pressable
            accessibilityLabel={
              selectionMode ? 'Cancel selection' : 'Enter selection mode'
            }
            accessibilityRole='button'
            accessibilityState={{ disabled: selectDisabled }}
            disabled={selectDisabled}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 8,
              opacity: selectDisabled ? 0.4 : 1,
            }}
            onPress={onSelectPress}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: fontWeights.semibold,
                color: selectColor,
                letterSpacing: -0.1,
              }}
            >
              {selectLabel}
            </Text>
          </Pressable>
        </View>
        <View style={{ paddingHorizontal: 20, paddingBottom: 4 }}>
          <Text
            style={[
              typography.heading1,
              {
                color: colors.text.primary,
                letterSpacing: -0.5,
                fontSize: 24,
                lineHeight: 30,
              },
            ]}
          >
            Archived Habits
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 6,
              marginTop: 6,
            }}
          >
            {habitCount > 0 ? <SettingsCountBadge count={habitCount} /> : null}
            <Text
              style={[
                typography.bodySmall,
                {
                  color: isDark ? colors.gray[400] : '#9B958E',
                  letterSpacing: -0.1,
                },
              ]}
            >
              {subtitle}
            </Text>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
}
