/** Shared head anatomy — icon tile + title + right-aligned value chip + description. */
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { fontWeights, typography } from '@/theme/typography';
import { useAdvancedTokens } from './useAdvancedTokens';

interface Props {
  icon: ReactNode;
  tileBackground: string;
  title: string;
  valueLabel: string;
  description: string;
}

export function AdvancedOptionsSectionHead({
  icon,
  tileBackground,
  title,
  valueLabel,
  description,
}: Props) {
  const t = useAdvancedTokens();
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginBottom: 4,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            backgroundColor: tileBackground,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </View>
        <Text
          style={{
            ...typography.body,
            fontSize: 15,
            fontWeight: fontWeights.semibold,
            color: t.fg,
            flex: 1,
          }}
        >
          {title}
        </Text>
        <View
          style={{
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 4,
            backgroundColor: t.tile,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              ...typography.caption,
              fontSize: 12,
              fontWeight: fontWeights.semibold,
              color: t.muted,
            }}
          >
            {valueLabel}
          </Text>
        </View>
      </View>
      <Text
        style={{
          ...typography.caption,
          color: t.meta,
          marginLeft: 42,
          marginBottom: 12,
        }}
      >
        {description}
      </Text>
    </>
  );
}
