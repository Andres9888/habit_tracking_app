/**
 * Template Preview Modal - Matches Edit Habit bottom sheet design
 */

import React, { useRef } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSwipeDismiss } from '../../../components/CreateHabitModal/hooks/useSwipeDismiss';
import { useThemeColors } from '../../../theme/ThemeContext';
import { shadows } from '../../../theme/spacing';
import { spacing } from '@/theme/spacing';
import { useTemplatePreview } from './useTemplatePreview';
import { ImportHeader } from './ImportHeader';
import { PreviewSheetBody } from './components/PreviewSheetBody';
import { localStyles } from './styles';
import type { TemplatePreviewModalProps } from './types';

// eslint-disable-next-line max-lines-per-function
export default function TemplatePreviewModal({
  importingTemplateId,
  onClose,
  onImport,
  template,
  visible,
}: TemplatePreviewModalProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();
  const { animateOut, backdropStyle, panGesture, sheetStyle } = useSwipeDismiss(
    { visible, onClose }
  );

  const preview = useTemplatePreview({
    onClose: animateOut,
    onImport,
    template,
  });
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
                  canImport={preview.customName.trim().length > 0}
                  isImporting={isImporting}
                  paddingTop={Math.max(insets.top + 4, 12)}
                  onCancel={animateOut}
                  onImport={preview.handleImport}
                />

                <PreviewSheetBody
                  isImporting={isImporting}
                  paddingBottom={insets.bottom + spacing.xl}
                  preview={preview}
                  scrollViewRef={scrollViewRef}
                  template={template}
                />
              </Animated.View>
            </KeyboardAvoidingView>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}
