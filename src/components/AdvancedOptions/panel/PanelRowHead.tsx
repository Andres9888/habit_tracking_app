/** Row head: hue tile · title/hint · value chip · trailing · chevron. */
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { fontWeights, typography } from '@/theme/typography';
import type { PanelHue } from './panelTokens';
import { usePanelTokens } from './panelTokens';
import { ValueChip } from './ValueChip';

export interface PanelRowHeadProps {
  hueTokens: PanelHue;
  icon: ReactNode;
  title: string;
  hint: string;
  hintColor?: string;
  value?: { label: string; set: boolean } | null;
  trailing?: ReactNode;
  open: boolean;
  showChevron: boolean;
  chevronStyle: object;
}

export function PanelRowHead({
  hueTokens,
  icon,
  title,
  hint,
  hintColor,
  value,
  trailing,
  open,
  showChevron,
  chevronStyle,
}: PanelRowHeadProps) {
  const t = usePanelTokens();
  return (
    <View
      style={{
        minHeight: open ? 36 : 60,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          backgroundColor: hueTokens.tile,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            ...typography.body,
            fontSize: 15,
            fontWeight: fontWeights.semibold,
            color: t.textPrimary,
          }}
        >
          {title}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            ...typography.label,
            fontSize: 12,
            fontWeight: fontWeights.medium,
            color: hintColor ?? t.textSecondary,
            marginTop: 1,
          }}
        >
          {hint}
        </Text>
      </View>
      {value ? (
        <ValueChip hue={hueTokens} label={value.label} set={value.set} />
      ) : null}
      {trailing}
      {showChevron ? (
        <Animated.View style={chevronStyle}>
          <ChevronDown
            color={t.chevron}
            size={iconSizes.small}
            strokeWidth={2.2}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}
