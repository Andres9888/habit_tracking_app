/** DisclosureRow — shared collapsible row shell: icon + label + value + chevron → content */
import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useExpandAnimation } from '@/hooks/useExpandAnimation';
import { triggerHaptic } from '@/utils/haptics';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  icon: ReactNode;
  iconBackgroundColor: string;
  label: string;
  subtitle?: string;
  valueLabel: string;
  children: ReactNode;
}

export function DisclosureRow({
  icon,
  iconBackgroundColor,
  label,
  subtitle,
  valueLabel,
  children,
}: Props) {
  const { colors: themeColors } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const [measured, setMeasured] = useState(false);

  const { contentAnimatedStyle, chevronAnimatedStyle } = useExpandAnimation({
    contentHeight: height,
    defaultExpanded: expanded,
    hasContentMeasured: measured,
    motion: 'spring',
    reduceMotion,
  });

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h <= 0) return;
    setHeight((prev) => (prev === h ? prev : h));
    setMeasured(true);
  }, []);

  const toggle = () => {
    void triggerHaptic('selection');
    setExpanded((v) => !v);
  };

  return (
    <>
      <SettingsRow
        icon={icon}
        iconBackgroundColor={iconBackgroundColor}
        label={label}
        rightAccessory={
          <View className='flex-row items-center' style={{ gap: 6 }}>
            <Text
              style={{
                ...typography.bodySmall,
                fontWeight: fontWeights.medium,
                color: themeColors.text.secondary,
              }}
            >
              {valueLabel}
            </Text>
            <Animated.View style={chevronAnimatedStyle}>
              <ChevronDown
                color={themeColors.text.secondary}
                size={iconSizes.small}
              />
            </Animated.View>
          </View>
        }
        subtitle={subtitle}
        type='info'
        onPress={toggle}
      />
      <Animated.View
        pointerEvents={expanded ? 'auto' : 'none'}
        style={contentAnimatedStyle}
      >
        <View onLayout={onLayout}>{children}</View>
      </Animated.View>
    </>
  );
}
