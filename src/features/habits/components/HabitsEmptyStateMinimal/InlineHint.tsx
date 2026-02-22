import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
  actionsColumnStyle,
  badgeContainerStyle,
  badgeTextStyle,
  buildMyOwnLabelStyle,
  containerStyle,
  dividerLineStyle,
  dividerStyle,
  getBuildMyOwnCardStyle,
  getTemplatesButtonStyle,
  templatesGradientStyle,
  templatesLabelStyle,
} from './InlineHint.styles';
import type { InlineHintProps } from './types';
import { useEmptyStateColors } from './useEmptyStateColors';

const templatesButtonPressableStyle = ({ pressed }: { pressed: boolean }) =>
  getTemplatesButtonStyle(pressed);

export function InlineHint({
  onBrowseTemplates,
  onCreateCustom,
}: InlineHintProps) {
  const colors = useEmptyStateColors();
  const buildMyOwnStyle = ({ pressed }: { pressed: boolean }) =>
    getBuildMyOwnCardStyle(pressed, { borderColor: colors.inputBorder });

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
      <View style={actionsColumnStyle}>
        <Pressable
          accessibilityHint='Opens screen with pre-made habit templates'
          accessibilityLabel='Browse habit templates'
          accessibilityRole='button'
          style={templatesButtonPressableStyle}
          testID='inline-hint-browse-templates'
          onPress={onBrowseTemplates}
        >
          <LinearGradient
            colors={['#047857', '#059669', '#10B981']}
            end={{ x: 1, y: 0.3 }}
            start={{ x: 0, y: 0 }}
            style={templatesGradientStyle}
          >
            <Text style={{ fontSize: 18 }}>📚</Text>
            <Text style={templatesLabelStyle}>browse templates</Text>
            <View style={badgeContainerStyle} testID='inline-hint-badge'>
              <Text style={badgeTextStyle}>200+</Text>
            </View>
          </LinearGradient>
        </Pressable>
        <Pressable
          accessibilityHint='Opens full habit creation screen'
          accessibilityLabel='Create custom habit'
          accessibilityRole='button'
          style={buildMyOwnStyle}
          testID='inline-hint-create-custom'
          onPress={onCreateCustom}
        >
          <Text style={{ fontSize: 18 }}>✏️</Text>
          <Text style={[buildMyOwnLabelStyle, { color: colors.textSecondary }]}>
            Build my own
          </Text>
          <Text style={{ color: colors.textTertiary, fontSize: 13 }}>→</Text>
        </Pressable>
      </View>
    </View>
  );
}
