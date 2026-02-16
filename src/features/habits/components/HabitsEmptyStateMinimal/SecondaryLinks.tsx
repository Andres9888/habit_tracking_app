/**
 * SecondaryLinks - Browse templates and create custom habit links
 *
 * Features:
 * - Centered row with dot separator
 * - Subtle hover state
 * - Minimal touch targets
 */

import { Pressable, View } from 'react-native';

import { AccessibleText } from '../../../../components/ui/AccessibleText';
import { COLORS, COPY, TOUCH_TARGETS } from './constants';
import type { SecondaryLinksProps } from './types';

/**
 * Secondary navigation links for templates and custom creation
 */
export function SecondaryLinks({
  onBrowseTemplates,
  onCreateCustom,
}: SecondaryLinksProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        gap: 24,
        justifyContent: 'center',
        marginTop: 24,
      }}
    >
      <Pressable
        accessibilityHint='Opens habit templates screen'
        accessibilityLabel={COPY.browseTemplates}
        accessibilityRole='button'
        style={({ pressed }) => ({
          justifyContent: 'center',
          minHeight: TOUCH_TARGETS.minSize,
          minWidth: TOUCH_TARGETS.minSize,
          opacity: pressed ? 0.7 : 1,
          paddingHorizontal: 8,
          paddingVertical: 8,
        })}
        onPress={onBrowseTemplates}
      >
        <AccessibleText
          scalingType="ui"
          style={{
            color: COLORS.stone500,
            fontSize: 13,
            fontWeight: '400',
          }}
        >
          {COPY.browseTemplates}
        </AccessibleText>
      </Pressable>

      {/* Dot separator */}
      <AccessibleText
        scalingType="ui"
        style={{
          color: COLORS.stone500,
          fontSize: 13,
        }}
      >
        •
      </AccessibleText>

      <Pressable
        accessibilityHint='Opens full habit creation screen'
        accessibilityLabel={COPY.createCustom}
        accessibilityRole='button'
        style={({ pressed }) => ({
          justifyContent: 'center',
          minHeight: TOUCH_TARGETS.minSize,
          minWidth: TOUCH_TARGETS.minSize,
          opacity: pressed ? 0.7 : 1,
          paddingHorizontal: 8,
          paddingVertical: 8,
        })}
        onPress={onCreateCustom}
      >
        <AccessibleText
          scalingType="ui"
          style={{
            color: COLORS.stone500,
            fontSize: 13,
            fontWeight: '400',
          }}
        >
          {COPY.createCustom}
        </AccessibleText>
      </Pressable>
    </View>
  );
}
