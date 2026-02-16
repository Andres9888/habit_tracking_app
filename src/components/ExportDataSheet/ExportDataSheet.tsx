/**
 * ExportDataSheet Component
 * Bottom sheet for exporting user habit data in CSV or JSON format
 */

import React, { useCallback, useState } from 'react';
import { Pressable, Modal, Dimensions, Text, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { FileText, Download } from 'lucide-react-native';

import { useThemeColors } from '../../theme/ThemeContext';

const DISMISS_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 500;
const SCREEN_HEIGHT = Dimensions.get('window').height;

interface ExportDataSheetProps {
  visible: boolean;
  onClose: () => void;
  onExportCSV: () => Promise<void>;
  onExportJSON: () => Promise<void>;
}

export const ExportDataSheet = ({
  visible,
  onClose,
  onExportCSV,
  onExportJSON,
}: ExportDataSheetProps) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();
  const translateY = useSharedValue(0);
  const [exporting, setExporting] = useState(false);

  React.useEffect(() => {
    if (visible) {
      translateY.value = 0;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [visible, translateY]);

  const handleDismiss = useCallback(() => {
    if (!exporting) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onClose();
    }
  }, [onClose, exporting]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0 && !exporting) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (exporting) return;
      const velocityY = Math.round(event.velocityY);
      if (
        event.translationY > DISMISS_THRESHOLD ||
        velocityY > VELOCITY_THRESHOLD
      ) {
        translateY.value = withSpring(SCREEN_HEIGHT, {
          damping: 20,
          stiffness: 150,
        });
        runOnJS(handleDismiss)();
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 150 });
      }
    });

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleExport = async (exportFn: () => Promise<void>) => {
    setExporting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await exportFn();
      // Close after successful export
      setTimeout(() => {
        setExporting(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error('Export failed:', error);
      setExporting(false);
    }
  };

  return (
    <Modal
      accessibilityViewIsModal
      transparent
      animationType='none'
      visible={visible}
      onRequestClose={handleDismiss}
    >
      <Animated.View
        className='absolute inset-0 bg-black/50'
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
      >
        <Pressable
          accessibilityLabel='Close export options'
          accessibilityRole='button'
          className='flex-1'
          onPress={handleDismiss}
        />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          className='absolute bottom-0 left-0 right-0 rounded-t-3xl shadow-xl'
          entering={SlideInDown.springify().damping(18).stiffness(150)}
          exiting={SlideOutDown.springify().damping(20).stiffness(200)}
          style={[
            { paddingBottom: insets.bottom + 16, backgroundColor: colors.surface },
            sheetAnimatedStyle,
          ]}
        >
          {/* Header */}
          <View className='items-center border-b px-6 py-4' style={{ borderBottomColor: colors.border }}>
            <View className='mb-2 h-1 w-12 rounded-full' style={{ backgroundColor: colors.border }} />
            <Text className='text-[17px] font-semibold' style={{ color: colors.text.primary }}>
              Export Your Data
            </Text>
            <Text className='mt-1 text-center text-[13px]' style={{ color: colors.text.secondary }}>
              Download your habit tracking data
            </Text>
          </View>

          {/* Export Options */}
          <View className='px-4 py-4'>
            {/* CSV Export */}
            <Pressable
              accessibilityLabel='Export as CSV'
              accessibilityHint='Export habit data in spreadsheet format'
              accessibilityRole='button'
              disabled={exporting}
              className='mb-3 flex-row items-center rounded-xl p-4'
              style={{
                backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                opacity: exporting ? 0.6 : 1,
              }}
              onPress={() => void handleExport(onExportCSV)}
            >
              <View
                className='mr-3 h-10 w-10 items-center justify-center rounded-xl'
                style={{ backgroundColor: '#dcfce7' }}
              >
                <FileText color='#16a34a' size={20} />
              </View>
              <View className='flex-1'>
                <Text className='text-[17px] font-semibold' style={{ color: colors.text.primary }}>
                  CSV Format
                </Text>
                <Text className='mt-0.5 text-[13px]' style={{ color: colors.text.secondary }}>
                  Open in Excel or Google Sheets
                </Text>
              </View>
              {exporting && <ActivityIndicator size='small' color={colors.text.secondary} />}
            </Pressable>

            {/* JSON Export */}
            <Pressable
              accessibilityLabel='Export as JSON'
              accessibilityHint='Export full habit data including streaks and strength'
              accessibilityRole='button'
              disabled={exporting}
              className='flex-row items-center rounded-xl p-4'
              style={{
                backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                opacity: exporting ? 0.6 : 1,
              }}
              onPress={() => void handleExport(onExportJSON)}
            >
              <View
                className='mr-3 h-10 w-10 items-center justify-center rounded-xl'
                style={{ backgroundColor: '#dbeafe' }}
              >
                <Download color='#2563eb' size={20} />
              </View>
              <View className='flex-1'>
                <Text className='text-[17px] font-semibold' style={{ color: colors.text.primary }}>
                  JSON Format
                </Text>
                <Text className='mt-0.5 text-[13px]' style={{ color: colors.text.secondary }}>
                  Complete data with streaks and strength
                </Text>
              </View>
              {exporting && <ActivityIndicator size='small' color={colors.text.secondary} />}
            </Pressable>

            {/* Privacy Notice */}
            <View className='mt-4 rounded-xl p-3' style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}>
              <Text className='text-center text-[13px]' style={{ color: colors.text.secondary }}>
                🔒 Your privacy is protected
              </Text>
              <Text className='mt-1 text-center text-[13px]' style={{ color: colors.text.tertiary }}>
                Export does not include auth tokens or internal IDs
              </Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
};

export default ExportDataSheet;
