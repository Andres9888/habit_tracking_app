/* eslint-disable max-lines */
/** SettingsRow - AnimatedPressable, scale animation, haptics, toggle pulse */
import { ReactNode } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import Animated, {
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { getSettingsRowColors } from './SettingsRow.colors';
import { useThemeColors } from '../../theme/ThemeContext';
import { useFocusRing } from '../../utils/accessibility';

interface SettingsRowProps {
  icon: ReactNode;
  iconBackgroundColor: string;
  label: string;
  subtitle?: string;
  type: 'toggle' | 'navigation' | 'selection' | 'info';
  value?: boolean | string;
  badge?: number;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  showBorder?: boolean;
  highContrastMode?: boolean;
  /** Override haptic: toggle→Medium, selection→Selection, navigation→Light */
  hapticStyle?: 'light' | 'medium' | 'heavy' | 'selection';
}

export function SettingsRow({
  icon,
  iconBackgroundColor,
  label,
  subtitle,
  type,
  value,
  badge,
  onPress,
  onToggle,
  showBorder = true,
  highContrastMode = false,
  hapticStyle,
}: SettingsRowProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const colors = getSettingsRowColors(highContrastMode, isDark);
  const { focusStyle, focusHandlers } = useFocusRing({ compact: true });
  const pulseOpacity = useSharedValue(0);
  const pulseColor = isDark ? 'rgba(52,211,153,0.08)' : 'rgba(5,150,105,0.06)';
  const pulseStyle = useAnimatedStyle(() => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: pulseColor,
    opacity: pulseOpacity.value,
  }));

  const handleToggle = (v: boolean) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    pulseOpacity.value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(0, { duration: 250 }),
    );
    onToggle?.(v);
  };

  const handleNavPress = () => {
    const style = hapticStyle ?? 'light';
    if (style === 'selection') {
      void Haptics.selectionAsync();
    } else {
      const map = {
        light: Haptics.ImpactFeedbackStyle.Light,
        medium: Haptics.ImpactFeedbackStyle.Medium,
        heavy: Haptics.ImpactFeedbackStyle.Heavy,
      } as const;
      void Haptics.impactAsync(map[style]);
    }
    onPress?.();
  };

  const content = (
    <View
      className={`flex-row items-center px-4 py-4 ${showBorder ? 'border-b' : ''}`}
      style={{
        backgroundColor: colors.background,
        borderColor: showBorder ? colors.border : undefined,
        overflow: 'hidden',
      }}
    >
      {type === 'toggle' ? <Animated.View style={pulseStyle} /> : null}
      <View
        className='mr-4 h-10 w-10 items-center justify-center rounded-xl'
        style={{
          backgroundColor: iconBackgroundColor,
          borderColor: highContrastMode ? '#facc15' : 'transparent',
          borderWidth: highContrastMode ? 2 : 0,
        }}
      >
        {icon}
      </View>
      <View className='flex-1'>
        <Text
          className='text-[17px] font-semibold'
          numberOfLines={type === 'toggle' || type === 'navigation' ? 2 : 1}
          ellipsizeMode='tail'
          style={{ color: colors.label }}
        >
          {label}
        </Text>
        {subtitle ? (
          <Text
            className='mt-0.5 text-[13px]'
            numberOfLines={2}
            style={{ color: themeColors.text.secondary }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {type === 'toggle' ? (
        <Switch
          accessibilityLabel={label}
          ios_backgroundColor={colors.switchTrackFalse}
          thumbColor={colors.switchThumb}
          trackColor={{
            false: colors.switchTrackFalse,
            true: colors.switchTrackTrue,
          }}
          value={value as boolean}
          onValueChange={handleToggle}
        />
      ) : null}
      {type === 'selection' ? <View className='flex-row items-center gap-1'>
          <Text
            className='text-[17px] font-medium'
            style={{ color: colors.value }}
          >
            {value as string}
          </Text>
          <ChevronRight color={colors.chevron} size={16} strokeWidth={2} />
        </View> : null}
      {type === 'info' && typeof value === 'string' ? <Text
          className='ml-3 text-[15px] font-medium'
          numberOfLines={1}
          style={{
            color: colors.value,
            flexShrink: 1,
            maxWidth: '45%',
            textAlign: 'right',
          }}
        >
          {value}
        </Text> : null}
      {type === 'navigation' ? <View className='flex-row items-center gap-2'>
          {badge != null && badge > 0 ? <Animated.View
              className='min-w-[22px] items-center justify-center rounded-full px-1.5 py-0.5'
              entering={ZoomIn.springify().damping(18)}
              style={{ backgroundColor: themeColors.surface }}
            >
              <Text
                className='text-[12px] font-bold'
                style={{ color: themeColors.text.secondary }}
              >
                {badge}
              </Text>
            </Animated.View> : null}
          <ChevronRight color={colors.chevron} size={16} strokeWidth={2} />
        </View> : null}
    </View>
  );

  if (type === 'toggle' || type === 'info') return content;

  return (
    <AnimatedPressable
      accessibilityLabel={label}
      accessibilityRole='button'
      style={focusStyle}
      onPress={handleNavPress}
      {...focusHandlers}
    >
      {content}
    </AnimatedPressable>
  );
}
