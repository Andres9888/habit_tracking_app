/**
 * VisualizationModal Component
 * Modal wrapper for the visualization guide
 */

import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, X } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { VisualizationGuide } from '../../../NotesSection/VisualizationGuide';

interface VisualizationModalProps {
  visible: boolean;
  onClose: () => void;
}

export const VisualizationModal: React.FC<VisualizationModalProps> = ({
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();

  return (
    <Modal
      accessibilityViewIsModal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1'>
        <LinearGradient
          className='absolute inset-0'
          colors={
            isDark
              ? [colors.background, colors.surface]
              : ['#f5f3ff', '#ffffff', '#fafaf9']
          }
        />
        <Animated.View
          className='flex-row items-center justify-between border-b px-5 pb-4'
          entering={FadeIn.delay(100)}
          style={{
            borderColor: colors.border,
            backgroundColor: isDark ? colors.surface : 'rgba(255,255,255,0.95)',
            paddingTop: insets.top + 8,
          }}
        >
          <View className='flex-row items-center gap-3'>
            <View className='h-10 w-10 items-center justify-center rounded-xl'>
              <LinearGradient
                className='absolute inset-0 rounded-xl'
                colors={['#7c3aed', '#4f46e5']}
                end={{ x: 1, y: 1 }}
                start={{ x: 0, y: 0 }}
              />
              <Eye color='#ffffff' size={20} />
            </View>
            <View>
              <Text
                className='text-lg font-bold'
                style={{ color: colors.text.primary }}
              >
                Visualization Guide
              </Text>
              <Text className='text-xs' style={{ color: colors.text.tertiary }}>
                Science-backed goal techniques
              </Text>
            </View>
          </View>
          <TouchableOpacity
            accessibilityLabel='Close visualization guide'
            accessibilityRole='button'
            className='h-10 w-10 items-center justify-center rounded-full'
            style={{ backgroundColor: colors.gray[200] }}
            onPress={onClose}
          >
            <X color={colors.text.secondary} size={24} />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView
          className='flex-1'
          contentContainerStyle={{
            padding: 20,
            paddingBottom: insets.bottom + 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          <VisualizationGuide onClose={onClose} />
        </ScrollView>
      </View>
    </Modal>
  );
};
