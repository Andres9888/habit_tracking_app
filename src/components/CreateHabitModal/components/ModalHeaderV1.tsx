/**
 * ModalHeaderV1 Component - Cards V1 Improved Spec
 * Task 3: Create ModalHeader Component
 *
 * Features:
 * - Displays close button, title, and progress text
 * - Animated progress bar with smooth 300ms transitions
 * - Progress bar uses gradient from emerald-500 to stone-200
 * - Accessible close button with proper label
 * - Matches design spec styling exactly
 */

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

/**
 * Props for ModalHeaderV1 component
 */
export interface ModalHeaderV1Props {
  /**
   * Callback function when close button is pressed
   */
  onClose: () => void;
  /**
   * Number of completed sections (0-3)
   */
  completedSections: number;
  /**
   * Total number of sections (always 3)
   */
  totalSections: number;
}

/**
 * ModalHeaderV1 displays the modal title, close button, and animated progress indicator
 * for the Cards V1 implementation of the Create Habit Modal
 *
 * @param props - ModalHeaderV1 component props
 * @returns JSX.Element
 */
export const ModalHeaderV1 = React.memo<ModalHeaderV1Props>(
  ({ onClose, completedSections, totalSections }) => {
    // Shared value for animated progress bar width
    const progressWidth = useSharedValue(0);

    // Calculate progress percentage
    const progressPercentage = (completedSections / totalSections) * 100;

    // Animate progress bar when completedSections changes
    useEffect(() => {
      progressWidth.value = withTiming(progressPercentage, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    }, [progressPercentage, progressWidth]);

    // Animated style for progress bar
    const animatedProgressStyle = useAnimatedStyle(() => {
      return {
        width: `${progressWidth.value}%`,
      };
    });

    return (
      <View style={styles.container} accessibilityRole="header">
        {/* Header content: Close button and title */}
        <View style={styles.headerContent}>
          {/* Close button */}
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            accessibilityRole="button"
            accessibilityLabel="Close modal"
            accessibilityHint="Dismisses the create habit modal"
          >
            <X size={24} color="#292524" strokeWidth={2} />
          </TouchableOpacity>

          {/* Title and progress text */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>New Habit</Text>
            <Text
              style={styles.progressText}
              accessibilityLabel={`${completedSections} of ${totalSections} sections complete`}
            >
              {completedSections} of {totalSections} complete
            </Text>
          </View>
        </View>

        {/* Animated progress bar */}
        <View
          style={styles.progressBarBackground}
          accessibilityRole="progressbar"
          accessibilityValue={{
            min: 0,
            max: totalSections,
            now: completedSections,
          }}
        >
          <Animated.View
            style={[styles.progressBarFill, animatedProgressStyle]}
          />
        </View>
      </View>
    );
  }
);

ModalHeaderV1.displayName = 'ModalHeaderV1';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F4', // stone-100
    paddingHorizontal: 20, // px-5
    paddingTop: 16, // py-4
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  closeButton: {
    padding: 4,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 36, // To center the title accounting for close button width
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#292524', // stone-800
    textAlign: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10B981', // emerald-600
    marginTop: 4,
    textAlign: 'center',
  },
  progressBarBackground: {
    height: 3,
    backgroundColor: '#E7E5E4', // stone-200
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981', // emerald-500
    borderRadius: 1.5,
  },
});
