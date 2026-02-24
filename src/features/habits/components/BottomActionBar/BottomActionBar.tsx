/**
 * BottomActionBar — Symmetric three-zone layout with frosted glass.
 * Left: Settings pill · Center: Raised squircle Add · Right: Templates pill.
 */

import { memo } from 'react';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { BookOpen, Settings, Plus } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { useBarAnimations } from './useBarAnimations';
import { PillButton } from './PillButton';
import { styles } from './BottomActionBar.styles';
import type { BottomActionBarProps } from './types';

const ENTERING = FadeInUp.duration(320).springify().damping(18);
const BLUR_INTENSITY = 40;
const BORDER_LIGHT = 'rgba(221,216,210,0.45)';
const BORDER_DARK = 'rgba(55,65,81,0.3)';
const FAB_BORDER_LIGHT = 'rgba(245,241,237,0.9)';
const FAB_BORDER_DARK = 'rgba(17,24,39,0.9)';

function BottomActionBarComponent(props: BottomActionBarProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();
  const anim = useBarAnimations();

  return (
    <Animated.View entering={ENTERING}>
      <BlurView intensity={BLUR_INTENSITY} tint={isDark ? 'dark' : 'light'}>
        <View
          style={[
            styles.container,
            {
              borderTopColor: isDark ? BORDER_DARK : BORDER_LIGHT,
              paddingBottom: Math.max(insets.bottom, 12),
            },
          ]}
        >
          <View style={styles.leftZone}>
            <Animated.View style={anim.settingsStyle}>
              <PillButton
                accessibilityLabel='Open settings'
                icon={<Settings color={colors.text.primary} size={15} strokeWidth={2.25} />}
                label='Settings'
                labelColor={colors.text.primary}
                onPress={props.onOpenSettings}
                onPressIn={anim.onSettingsPressIn}
                onPressOut={anim.onSettingsPressOut}
              />
            </Animated.View>
          </View>

          <View style={styles.centerZone}>
            <Animated.View style={anim.addStyle}>
              <Pressable
                accessibilityLabel='Add new habit'
                accessibilityRole='button'
                style={[
                  styles.addButton,
                  {
                    backgroundColor: colors.primary[600],
                    borderColor: isDark ? FAB_BORDER_DARK : FAB_BORDER_LIGHT,
                  },
                ]}
                onPress={props.onAddHabit}
                onPressIn={anim.onAddPressIn}
                onPressOut={anim.onAddPressOut}
              >
                <Plus color='#ffffff' size={24} strokeWidth={2.5} />
              </Pressable>
            </Animated.View>
          </View>

          <View style={styles.rightZone}>
            <Animated.View style={anim.templatesStyle}>
              <PillButton
                accessibilityLabel='Browse habit templates'
                icon={<BookOpen color={colors.text.secondary} size={14} strokeWidth={2.25} />}
                label='Templates'
                labelColor={colors.text.secondary}
                onPress={props.onOpenTemplates}
                onPressIn={anim.onTemplatesPressIn}
                onPressOut={anim.onTemplatesPressOut}
              />
            </Animated.View>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
}

export const BottomActionBar = memo(BottomActionBarComponent);
