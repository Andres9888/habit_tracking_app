import { Pressable, Text, View } from 'react-native';

import type { InlineHintProps } from './types';
import { useEmptyStateColors } from './useEmptyStateColors';

const containerStyle = {
  alignItems: 'center',
  marginTop: 16,
  width: '100%',
} as const;
const dividerStyle = {
  alignItems: 'center',
  flexDirection: 'row',
  gap: 10,
  marginBottom: 10,
  width: '100%',
} as const;
const dividerLineStyle = { flex: 1, height: 0.5 } as const;
const actionsRowStyle = {
  flexDirection: 'row',
  gap: 12,
  justifyContent: 'center',
} as const;
const linkTextStyle = {
  fontSize: 13,
  fontWeight: '600',
  lineHeight: 18,
} as const;
const linkBaseStyle = {
  alignItems: 'center',
  borderRadius: 9999,
  borderWidth: 1,
  justifyContent: 'center',
  minHeight: 44,
  paddingHorizontal: 16,
  paddingVertical: 12,
} as const;

export function InlineHint({
  onBrowseTemplates,
  onCreateCustom,
}: InlineHintProps) {
  const colors = useEmptyStateColors();
  const linkStyle = ({ pressed }: { pressed: boolean }) => ({
    ...linkBaseStyle,
    backgroundColor: pressed
      ? colors.linkBackgroundPressed
      : colors.linkBackground,
    borderColor: colors.linkBorder,
    opacity: pressed ? 0.9 : 1,
  });

  return (
    <View style={containerStyle}>
      <View style={dividerStyle} testID='inline-hint-divider'>
        <View
          style={[dividerLineStyle, { backgroundColor: colors.inputBorder }]}
          testID='inline-hint-divider-line-left'
        />
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 13,
            lineHeight: 18,
            textAlign: 'center',
          }}
        >
          or explore
        </Text>
        <View
          style={[dividerLineStyle, { backgroundColor: colors.inputBorder }]}
          testID='inline-hint-divider-line-right'
        />
      </View>
      <View style={actionsRowStyle}>
        <Pressable
          accessibilityHint='Opens screen with pre-made habit templates'
          accessibilityLabel='Browse habit templates'
          accessibilityRole='button'
          style={linkStyle}
          onPress={onBrowseTemplates}
        >
          <Text style={[linkTextStyle, { color: colors.linkText }]}>
            📋 browse templates
          </Text>
        </Pressable>
        <Pressable
          accessibilityHint='Opens full habit creation screen'
          accessibilityLabel='Create custom habit'
          accessibilityRole='button'
          style={linkStyle}
          onPress={onCreateCustom}
        >
          <Text style={[linkTextStyle, { color: colors.linkText }]}>
            ✨ create custom
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
