/**
 * Template Preview Modal - Matches Edit Habit bottom sheet design
 */

import React, { useRef, useState } from 'react';
import {
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSwipeDismiss } from '../../../components/CreateHabitModal/hooks/useSwipeDismiss';
import { EmojiPicker } from '../../../components/CreateHabitModal/components/EmojiPicker';
import { ColorPickerSection } from '../../../components/CreateHabitModal/components/ColorPickerSection';
import { EnhancedReminderSelector } from '../../../components/CreateHabitModal/components/EnhancedReminderSelector';
import { HABIT_COLORS } from '../../../components/CreateHabitModal/constants';
import { AdvancedOptionsSection } from '../../../components/AdvancedOptions';
import { useThemeColors } from '../../../theme/ThemeContext';
import { colors as palette } from '../../../theme/colors';
import { borderRadius, shadows } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';
import { spacing } from '@/theme/spacing';
import { useTemplatePreview } from './useTemplatePreview';
import { ImportHeader } from './ImportHeader';
import { TemplatePreview } from './TemplatePreview';
import { TemplateInfo } from './TemplateInfo';
import { buildTextInputHintProps } from '@/utils/textInputHintProps';
import type { TemplatePreviewModalProps } from './types';

const entrance = (delay: number) =>
  FadeInUp.delay(delay).duration(280).easing(Easing.out(Easing.cubic));

// eslint-disable-next-line max-lines-per-function
export default function TemplatePreviewModal({
  importingTemplateId,
  onClose,
  onImport,
  template,
  visible,
}: TemplatePreviewModalProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();
  const { animateOut, backdropStyle, panGesture, sheetStyle } = useSwipeDismiss(
    { visible, onClose }
  );

  const {
    customName,
    setCustomName,
    customIcon,
    customColor,
    showTimePicker,
    setShowTimePicker,
    reminderTime,
    strengthAlgorithm,
    progressEmojis,
    streakGoal,
    handleImport,
    handleColorSelect,
    handleIconSelect,
    handleTimeChange,
    handleStrengthAlgorithmChange,
    handleProgressEmojisChange,
    handleStreakGoalChange,
  } = useTemplatePreview({ onClose: animateOut, onImport, template });

  const [isFocused, setIsFocused] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  if (!template) return null;

  const isImporting = importingTemplateId === template._id;

  return (
    <Modal
      accessibilityViewIsModal
      statusBarTranslucent
      transparent
      animationType='none'
      visible={visible}
      onRequestClose={animateOut}
    >
      <View className='flex-1'>
        <Pressable style={StyleSheet.absoluteFill} onPress={animateOut}>
          <Animated.View className='flex-1 bg-black' style={backdropStyle} />
        </Pressable>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            className='overflow-hidden rounded-t-3xl'
            style={[
              localStyles.sheet,
              sheetStyle,
              { backgroundColor: colors.surface },
              shadows.alert,
            ]}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className='flex-1'
            >
              <Animated.View
                entering={FadeIn.duration(300)}
                style={{ flex: 1 }}
              >
                <View style={localStyles.dragHandleRow}>
                  <View
                    style={[
                      localStyles.dragHandle,
                      { backgroundColor: colors.gray[300] },
                    ]}
                  />
                </View>

                <ImportHeader
                  canImport={customName.trim().length > 0}
                  isImporting={isImporting}
                  paddingTop={Math.max(insets.top + 4, 12)}
                  onCancel={animateOut}
                  onImport={handleImport}
                />

                <ScrollView
                  ref={scrollViewRef}
                  className='flex-1'
                  contentContainerStyle={{
                    paddingBottom: insets.bottom + spacing.xl,
                  }}
                  keyboardDismissMode='on-drag'
                  keyboardShouldPersistTaps='handled'
                  showsVerticalScrollIndicator={false}
                >
                  <Pressable onPress={Keyboard.dismiss}>
                    <View
                      className='items-center px-6'
                      style={{
                        marginBottom: spacing['2xl'],
                        marginTop: spacing.xl,
                      }}
                    >
                      <Animated.View
                        className='mb-4'
                        entering={FadeInDown.duration(280)
                          .delay(100)
                          .easing(Easing.out(Easing.cubic))}
                      >
                        <TemplatePreview
                          customColor={customColor}
                          description={template.description}
                          icon={customIcon ?? template.icon}
                        />
                      </Animated.View>

                      <Animated.View
                        className='w-full'
                        entering={FadeInUp.duration(280)
                          .delay(160)
                          .easing(Easing.out(Easing.cubic))}
                      >
                        <TextInput
                          accessibilityLabel='Habit name'
                          className='w-full rounded-2xl border-2 px-5 py-4 text-center text-2xl font-medium'
                          editable={!isImporting}
                          maxLength={50}
                          returnKeyType='done'
                          style={{
                            lineHeight: 28,
                            color: colors.text.primary,
                            backgroundColor: isDark
                              ? colors.card
                              : palette.light.surfaceMuted,
                            borderColor: isFocused
                              ? colors.primary[600]
                              : colors.border,
                          }}
                          value={customName}
                          {...buildTextInputHintProps(
                            'Name your habit',
                            colors.text.tertiary
                          )}
                          onBlur={() => setIsFocused(false)}
                          onChangeText={setCustomName}
                          onFocus={() => setIsFocused(true)}
                          onSubmitEditing={Keyboard.dismiss}
                        />
                      </Animated.View>
                    </View>

                    <Animated.View
                      className='px-6'
                      entering={FadeInUp.delay(280)
                        .duration(280)
                        .easing(Easing.out(Easing.cubic))}
                    >
                      <Text
                        className='mb-3 text-center uppercase'
                        style={{
                          ...typography.caption,
                          fontWeight: fontWeights.semibold,
                          letterSpacing: 0.5,
                          color: colors.text.tertiary,
                        }}
                      >
                        Choose an icon
                      </Text>

                      <Animated.View entering={entrance(0)}>
                        <EmojiPicker
                          hideLabel
                          habitName={customName}
                          selectedEmoji={customIcon}
                          onSelect={handleIconSelect}
                        />
                      </Animated.View>

                      <Text
                        className='mb-3 mt-4 text-center uppercase'
                        style={{
                          ...typography.caption,
                          fontWeight: fontWeights.semibold,
                          letterSpacing: 0.5,
                          color: colors.text.tertiary,
                        }}
                      >
                        Pick a color
                      </Text>

                      <Animated.View entering={entrance(60)}>
                        <ColorPickerSection
                          hideLabel
                          colors={HABIT_COLORS}
                          selectedColor={customColor}
                          onSelectColor={handleColorSelect}
                        />
                      </Animated.View>

                      <Animated.View entering={entrance(120)}>
                        <EnhancedReminderSelector
                          enabled={showTimePicker}
                          reminderTime={reminderTime}
                          onTimeChange={handleTimeChange}
                          onToggle={setShowTimePicker}
                        />
                      </Animated.View>
                    </Animated.View>

                    <AdvancedOptionsSection
                      growthType={template.growthType}
                      progressEmojis={progressEmojis}
                      streakGoal={streakGoal}
                      strengthAlgorithm={strengthAlgorithm}
                      onExpand={() =>
                        scrollViewRef.current?.scrollToEnd({ animated: true })
                      }
                      onProgressEmojisChange={handleProgressEmojisChange}
                      onStreakGoalChange={handleStreakGoalChange}
                      onStrengthAlgorithmChange={handleStrengthAlgorithmChange}
                    />

                    <Animated.View
                      className='mt-4 px-6'
                      entering={entrance(460)}
                    >
                      <TemplateInfo
                        category={template.category}
                        frequency={template.frequency}
                      />
                    </Animated.View>
                  </Pressable>
                </ScrollView>
              </Animated.View>
            </KeyboardAvoidingView>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  dragHandle: { borderRadius: borderRadius.xs, height: 5, width: 36 },
  dragHandleRow: { alignItems: 'center', paddingBottom: 4, paddingTop: 8 },
  sheet: StyleSheet.absoluteFillObject,
});
