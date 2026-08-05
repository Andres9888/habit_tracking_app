/** AdvancedSheet — shared bottom-sheet chrome for Advanced Options editors. */
import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSwipeDismiss } from '@/components/CreateHabitModal/hooks/useSwipeDismiss';
import { useThemeColors } from '@/theme/ThemeContext';
import { borderRadius, shadows } from '@/theme/spacing';
import { fontWeights, typography } from '@/theme/typography';

interface AdvancedSheetProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}

export function AdvancedSheet({
  visible,
  title,
  subtitle,
  onClose,
  children,
}: AdvancedSheetProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();
  const { animateOut, backdropStyle, panGesture, sheetStyle } = useSwipeDismiss(
    { visible, onClose }
  );

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
            className='absolute bottom-0 left-0 right-0 rounded-t-3xl'
            style={[
              sheetStyle,
              {
                backgroundColor: colors.surface,
                maxHeight: '86%',
                paddingBottom: insets.bottom + 20,
                ...shadows.card,
              },
            ]}
          >
            <View style={styles.dragHandleRow}>
              <View
                style={[
                  styles.dragHandle,
                  { backgroundColor: colors.gray[300] },
                ]}
              />
            </View>
            <View className='px-5 pb-3'>
              <Text
                style={{
                  ...typography.heading3,
                  fontWeight: fontWeights.bold,
                  color: colors.text.primary,
                }}
              >
                {title}
              </Text>
              {subtitle ? (
                <Text
                  style={{
                    ...typography.caption,
                    color: colors.text.tertiary,
                    marginTop: 4,
                  }}
                >
                  {subtitle}
                </Text>
              ) : null}
            </View>
            <View className='px-4'>{children}</View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dragHandle: { borderRadius: borderRadius.xs, height: 5, width: 36 },
  dragHandleRow: { alignItems: 'center', paddingBottom: 10, paddingTop: 10 },
});
