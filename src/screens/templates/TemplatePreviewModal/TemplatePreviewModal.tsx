/**
 * Template Preview Modal - Matches Edit Habit bottom sheet design
 */

import React, { useState } from 'react';
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
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSwipeDismiss } from '../../../components/CreateHabitModal/hooks/useSwipeDismiss';
import { EmojiPicker } from '../../../components/CreateHabitModal/components/EmojiPicker';
import { ColorPickerSection } from '../../../components/CreateHabitModal/components/ColorPickerSection';
import { EnhancedReminderSelector } from '../../../components/CreateHabitModal/components/EnhancedReminderSelector';
import { HABIT_COLORS } from '../../../components/CreateHabitModal/constants';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius, shadows } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { useTemplatePreview } from './useTemplatePreview';
import { ImportHeader } from './ImportHeader';
import { TemplatePreview } from './TemplatePreview';
import { PreferredTimePicker } from './PreferredTimePicker';
import { DaysOfWeekPicker } from './DaysOfWeekPicker';
import { TemplateInfo } from './TemplateInfo';
import { buildTextInputHintProps } from '@/utils/textInputHintProps';
import type { TemplatePreviewModalProps } from './types';

const entrance = (delay: number) => FadeInUp.delay(delay).springify().damping(18);

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
    customColor,
    showTimePicker,
    setShowTimePicker,
    preferredTime,
    selectedDays,
    reminderTime,
    handleImport,
    handleColorSelect,
    handleSelectPreferredTime,
    handleToggleDay,
    handleTimeChange,
  } = useTemplatePreview({ onClose: animateOut, onImport, template });

  const [isFocused, setIsFocused] = useState(false);

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
            className='overflow-hidden rounded-t-3xl shadow-2xl'
            style={[
              localStyles.sheet,
              sheetStyle,
              { backgroundColor: colors.surface },
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
                  className='flex-1'
                  contentContainerStyle={{
                    paddingBottom: insets.bottom + 32,
                  }}
                  keyboardDismissMode='on-drag'
                  keyboardShouldPersistTaps='handled'
                  showsVerticalScrollIndicator={false}
                >
                  <Pressable onPress={Keyboard.dismiss}>
                    {/* Hero title + name input */}
                    <View
                      className='items-center px-6'
                      style={{ marginBottom: 24, marginTop: 16 }}
                    >
                      <Animated.View
                        className='mb-4'
                        entering={FadeInDown.duration(280).delay(100).springify().damping(18)}
                      >
                        <TemplatePreview
                          customColor={customColor}
                          description={template.description}
                          icon={template.icon}
                        />
                      </Animated.View>

                      <Animated.View
                        className='w-full'
                        entering={FadeInUp.duration(280).delay(160).springify().damping(18)}
                      >
                        <TextInput
                          accessibilityLabel='Habit name'
                          className='w-full rounded-2xl border-2 px-5 py-4 text-center text-[22px] font-medium'
                          editable={!isImporting}
                          maxLength={50}
                          returnKeyType='done'
                          style={{
                            lineHeight: 28,
                            color: colors.text.primary,
                            backgroundColor: isDark ? colors.card : '#FFFFFF',
                            borderColor: isFocused ? colors.primary[600] : colors.border,
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
                        <Text
                          className='mt-2 text-center'
                          style={{ ...typography.caption, color: colors.text.tertiary }}
                        >
                          {customName.length}/50 characters
                        </Text>
                      </Animated.View>
                    </View>

                    {/* Customize section - matches Edit Habit */}
                    <Animated.View
                      className='px-6'
                      entering={entrance(280)}
                    >
                      <Text
                        className='mb-3 text-center uppercase'
                        style={{
                          ...typography.caption,
                          fontWeight: '600',
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

                    {/* Schedule section */}
                    <Animated.View
                      className='px-6'
                      entering={entrance(340)}
                    >
                      <Text
                        className='mt-4 mb-3 text-center uppercase'
                        style={{
                          ...typography.caption,
                          fontWeight: '600',
                          letterSpacing: 0.5,
                          color: colors.text.tertiary,
                        }}
                      >
                        Schedule
                      </Text>
                      <Animated.View
                        className='rounded-2xl p-4'
                        style={{
                          backgroundColor: colors.card,
                          ...shadows.card,
                        }}
                      >
                        <PreferredTimePicker
                          disabled={isImporting}
                          selectedTime={preferredTime}
                          onSelectTime={handleSelectPreferredTime}
                        />
                        <DaysOfWeekPicker
                          disabled={isImporting}
                          selectedDays={selectedDays}
                          onToggleDay={handleToggleDay}
                        />
                      </Animated.View>
                    </Animated.View>

                    {/* Template info */}
                    <Animated.View
                      className='px-6 mt-4'
                      entering={entrance(400)}
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
