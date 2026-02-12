/* eslint-disable max-lines */

/**
 * SuccessContent - Text and action content for success state
 *
 * Displays headline, subtext, tap hint, add another button,
 * and a "Browse templates" nudge for first-time habit creators.
 */

import { Pressable, Text, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';

import { BORDER_RADIUS, COLORS, COPY, TOUCH_TARGETS } from './constants';

interface SuccessContentProps {
  habitName: string;
  autoTransition: boolean;
  contentStyle: AnimatedStyle<ViewStyle>;
  tapHintStyle: AnimatedStyle<ViewStyle>;
  onAddAnother: () => void;
  onBrowseTemplates?: () => void;
}

/**
 * Headline text
 */
function Headline() {
  return (
    <Text
      style={{
        color: COLORS.stone800,
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
      }}
    >
      {COPY.successHeadline}
    </Text>
  );
}

/**
 * Subtext with habit name
 */
function Subtext({ habitName }: { habitName: string }) {
  return (
    <Text
      style={{
        color: COLORS.stone500,
        fontSize: 13,
        marginBottom: 24,
        textAlign: 'center',
      }}
    >
      {COPY.successSubtext(habitName)}
    </Text>
  );
}

/**
 * Tap hint for auto-transition mode
 */
function TapHint({ style }: { style: AnimatedStyle<ViewStyle> }) {
  return (
    <Animated.Text
      style={[
        style,
        {
          color: COLORS.stone500,
          fontSize: 13,
          textAlign: 'center',
        },
      ]}
    >
      Tap anywhere to continue
    </Animated.Text>
  );
}

/**
 * Add another habit button
 */
function AddAnotherButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityHint='Creates another habit'
      accessibilityLabel={COPY.addAnother}
      accessibilityRole='button'
      style={({ pressed }) => ({
        alignItems: 'center',
        backgroundColor: COLORS.stone800,
        borderRadius: BORDER_RADIUS.cta,
        height: TOUCH_TARGETS.ctaHeight,
        justifyContent: 'center',
        opacity: pressed ? 0.9 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
        width: '100%',
      })}
      onPress={onPress}
    >
      <Text
        style={{
          color: '#ffffff',
          fontSize: 17,
          fontWeight: '600',
        }}
      >
        {COPY.addAnother}
      </Text>
    </Pressable>
  );
}

/**
 * Browse templates nudge button
 */
function BrowseTemplatesButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityHint='Opens screen with pre-made habit templates'
      accessibilityLabel='Browse templates'
      accessibilityRole='button'
      style={({ pressed }) => ({
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        minHeight: TOUCH_TARGETS.minSize,
        opacity: pressed ? 0.7 : 1,
        paddingVertical: 8,
      })}
      onPress={onPress}
    >
      <Text
        style={{
          color: '#7c3aed',
          fontSize: 15,
          fontWeight: '500',
        }}
      >
        Browse templates →
      </Text>
    </Pressable>
  );
}

/**
 * Success content component
 */
export function SuccessContent({
  habitName,
  autoTransition,
  contentStyle,
  tapHintStyle,
  onAddAnother,
  onBrowseTemplates,
}: SuccessContentProps) {
  return (
    <Animated.View
      style={[contentStyle, { alignItems: 'center', width: '100%' }]}
    >
      <Headline />
      <Subtext habitName={habitName} />

      {autoTransition && <TapHint style={tapHintStyle} />}

      {!autoTransition && <AddAnotherButton onPress={onAddAnother} />}

      {!autoTransition && onBrowseTemplates && (
        <BrowseTemplatesButton onPress={onBrowseTemplates} />
      )}
    </Animated.View>
  );
}
