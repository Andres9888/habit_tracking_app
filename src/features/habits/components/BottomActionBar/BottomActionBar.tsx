/**
 * BottomActionBar — persistent action bar anchored to the bottom of the screen.
 * Variant 2: Raised Center Add button with spring scale animations.
 */

import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BookOpen, Settings, Plus } from 'lucide-react-native';
import { DailyProgressRing } from '../../../../components/DailyProgressRing';
import { useIsDark, useThemeColors } from '../../../../theme/ThemeContext';
import { useBarAnimations } from './useBarAnimations';
import type { BottomActionBarProps } from './types';

const ENTERING = FadeInUp.duration(320).springify().damping(18);

// eslint-disable-next-line max-lines-per-function
function BottomActionBarComponent(props: BottomActionBarProps) {
  const { completedToday, totalHabits } = props;
  const insets = useSafeAreaInsets();
  const isDark = useIsDark();
  const { colors: themeColors } = useThemeColors();
  const anim = useBarAnimations();

  const percentage =
    totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const bgColor = isDark ? 'rgba(23,23,23,0.97)' : 'rgba(255,255,255,0.97)';
  const iconColor = isDark ? '#D1D5DB' : '#44403c';

  return (
    <Animated.View entering={ENTERING}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 12),
          borderTopWidth: 1,
          borderTopColor: isDark ? '#333' : '#f0eeee',
          backgroundColor: bgColor,
          overflow: 'visible',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            flexShrink: 1,
          }}
        >
          <DailyProgressRing
            completed={completedToday}
            size={32}
            strokeWidth={4}
            total={totalHabits}
          />
          <View>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: themeColors.text.primary,
              }}
            >
              {completedToday} of {totalHabits} done
            </Text>
            <Text style={{ fontSize: 10, fontWeight: '500', color: '#78716c' }}>
              {percentage}% complete
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            overflow: 'visible',
          }}
        >
          <Animated.View style={anim.templatesStyle}>
            <Pressable
              style={{
                backgroundColor: '#7c3aed',
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                height: 32,
                paddingHorizontal: 8,
              }}
              onPress={() => {
                props.onDismissTemplateBadge();
                props.onOpenTemplates();
              }}
              onPressIn={anim.onTemplatesPressIn}
              onPressOut={anim.onTemplatesPressOut}
            >
              <BookOpen color={themeColors.text.inverse} size={12} strokeWidth={2.25} />
              <Text style={{ color: themeColors.text.inverse, fontSize: 11, fontWeight: '600' }}>
                Templates
              </Text>
            </Pressable>
          </Animated.View>

          <Animated.View style={anim.settingsStyle}>
            <Pressable
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: isDark ? '#374151' : '#e7e5e4',
                backgroundColor: isDark ? 'rgba(31,41,55,0.8)' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={props.onOpenSettings}
              onPressIn={anim.onSettingsPressIn}
              onPressOut={anim.onSettingsPressOut}
            >
              <Settings color={iconColor} size={14} strokeWidth={2.25} />
            </Pressable>
          </Animated.View>

          <Animated.View style={anim.addStyle}>
            <Pressable
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#059669',
                borderWidth: 3,
                borderColor: bgColor,
                marginTop: -16,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={props.onAddHabit}
              onPressIn={anim.onAddPressIn}
              onPressOut={anim.onAddPressOut}
            >
              <Plus color={themeColors.text.inverse} size={22} strokeWidth={2.5} />
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
}

export const BottomActionBar = memo(BottomActionBarComponent);
