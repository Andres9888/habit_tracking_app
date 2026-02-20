/**
 * BottomActionBar — Symmetric three-zone layout.
 * Left: Settings pill · Center: Raised Add button · Right: Templates pill.
 */

import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BookOpen, Settings, Plus } from 'lucide-react-native';
import { useIsDark } from '../../../../theme/ThemeContext';
import { useBarAnimations } from './useBarAnimations';
import { styles } from './BottomActionBar.styles';
import type { BottomActionBarProps } from './types';

const ENTERING = FadeInUp.duration(320).springify().damping(18);
const BG_LIGHT = 'rgba(255,255,255,0.92)';
const BG_DARK = 'rgba(17,17,17,0.92)';

function BottomActionBarComponent(props: BottomActionBarProps) {
  const insets = useSafeAreaInsets();
  const isDark = useIsDark();
  const anim = useBarAnimations();
  const iconColor = isDark ? '#9ca3af' : '#44403c';

  return (
    <Animated.View entering={ENTERING}>
      <View
        style={[
          styles.container,
          isDark ? styles.containerBorderDark : styles.containerBorderLight,
          {
            backgroundColor: isDark ? BG_DARK : BG_LIGHT,
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        {/* Left zone: Settings pill */}
        <View style={styles.leftZone}>
          <Animated.View style={anim.settingsStyle}>
            <Pressable
              accessibilityLabel='Open settings'
              accessibilityRole='button'
              style={[
                styles.settingsButton,
                isDark ? styles.settingsDark : styles.settingsLight,
              ]}
              onPress={props.onOpenSettings}
              onPressIn={anim.onSettingsPressIn}
              onPressOut={anim.onSettingsPressOut}
            >
              <Settings color={iconColor} size={15} strokeWidth={2.25} />
              <Text
                style={[
                  styles.settingsLabel,
                  isDark ? styles.settingsLabelDark : styles.settingsLabelLight,
                ]}
              >
                Settings
              </Text>
            </Pressable>
          </Animated.View>
        </View>

        {/* Center zone: Raised Add button */}
        <View style={styles.centerZone}>
          <Animated.View style={anim.addStyle}>
            <Pressable
              accessibilityLabel='Add new habit'
              accessibilityRole='button'
              style={[
                styles.addButton,
                isDark
                  ? [styles.addBorderDark, styles.addButtonDark]
                  : styles.addBorderLight,
              ]}
              onPress={props.onAddHabit}
              onPressIn={anim.onAddPressIn}
              onPressOut={anim.onAddPressOut}
            >
              <Plus color='#ffffff' size={22} strokeWidth={2.5} />
            </Pressable>
          </Animated.View>
        </View>

        {/* Right zone: Templates pill with badge */}
        <View style={styles.rightZone}>
          <Animated.View style={anim.templatesStyle}>
            <View style={styles.templatesWrapper}>
              <Pressable
                accessibilityLabel='Browse habit templates'
                accessibilityRole='button'
                style={styles.templatesButton}
                onPress={() => {
                  props.onDismissTemplateBadge();
                  props.onOpenTemplates();
                }}
                onPressIn={anim.onTemplatesPressIn}
                onPressOut={anim.onTemplatesPressOut}
              >
                <BookOpen color='#ffffff' size={14} strokeWidth={2.25} />
                <Text style={styles.templatesLabel}>Templates</Text>
              </Pressable>
              {props.showTemplateBadge && (
                <View
                  style={[
                    styles.badgeDot,
                    isDark
                      ? styles.badgeDotBorderDark
                      : styles.badgeDotBorderLight,
                  ]}
                />
              )}
            </View>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
}

export const BottomActionBar = memo(BottomActionBarComponent);
