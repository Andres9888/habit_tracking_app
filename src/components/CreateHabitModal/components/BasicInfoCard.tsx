/**
 * BasicInfoCard Component - Cards V1 Improved Spec
 * Task 4: Create BasicInfoCard Component
 *
 * Features:
 * - Card wrapper for habit name input with completion state
 * - Header displays icon, title, required badge, and completion checkmark
 * - Integrates HabitNameField component
 * - Shows character count (dynamic, updates on typing)
 * - Completion checkmark appears when habitName.trim().length > 0
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Edit3, CheckCircle, Circle } from 'lucide-react-native';
import { CompletionBadge } from './CompletionBadge';
import { HabitNameField } from './HabitNameField';

/**
 * Props for BasicInfoCard component
 */
export interface BasicInfoCardProps {
  /**
   * Current habit name value
   */
  habitName: string;
  /**
   * Callback when habit name changes
   */
  onHabitNameChange: (name: string) => void;
  /**
   * Whether the card section is complete
   * True if habitName.trim().length > 0
   */
  isComplete: boolean;
  /**
   * Whether to auto-focus the input field
   * @default false
   */
  autoFocus?: boolean;
}

/**
 * BasicInfoCard displays the habit name input field within a card wrapper
 * with completion tracking and visual feedback
 *
 * Design specs:
 * - Card wrapper with shadow and rounded corners
 * - Header with Edit3 icon, "BASIC INFO" title, required badge, and completion state
 * - Character counter shows "{count} chars" in emerald-600 when valid
 * - Completion checkmark appears when habitName is non-empty
 *
 * @param props - BasicInfoCard component props
 * @returns JSX.Element
 */
export const BasicInfoCard = React.memo<BasicInfoCardProps>(
  ({ habitName, onHabitNameChange, isComplete, autoFocus = false }) => {
    // Calculate character count for display
    const characterCount = useMemo(
      () => habitName.trim().length,
      [habitName]
    );

    return (
      <View
        style={styles.card}
        accessibilityRole="group"
        accessibilityLabel="Basic information section"
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          {/* Left side: Icon and title */}
          <View style={styles.headerLeft}>
            <Edit3 size={18} color="#10B981" strokeWidth={2} />
            <Text style={styles.cardTitle}>Basic Info</Text>
          </View>

          {/* Right side: Badge and completion state */}
          <View style={styles.headerRight}>
            <CompletionBadge type="required" />
            {isComplete ? (
              <CheckCircle
                size={20}
                color="#10B981"
                fill="#10B981"
                strokeWidth={2}
                accessibilityLabel="Section complete"
              />
            ) : (
              <Circle
                size={20}
                color="#D6D3D1"
                strokeWidth={2}
                accessibilityLabel="Section incomplete"
              />
            )}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <HabitNameField
            value={habitName}
            onChange={onHabitNameChange}
            autoFocus={autoFocus}
          />

          {/* Helper text and character counter row */}
          <View style={styles.footerRow}>
            <Text style={styles.helperText}>
              Make it specific and actionable
            </Text>
            {characterCount > 0 && (
              <Text
                style={styles.characterCounter}
                accessibilityLabel={`${characterCount} characters entered`}
              >
                {characterCount} chars
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  }
);

BasicInfoCard.displayName = 'BasicInfoCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16, // rounded-2xl
    padding: 16, // p-4
    marginBottom: 20, // mb-5
    // Shadow configuration for iOS and Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16, // mb-4
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#1C1917', // stone-900
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  content: {
    // Content area styles
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6, // mt-1.5
  },
  helperText: {
    fontSize: 12,
    color: '#A8A29E', // stone-400
  },
  characterCounter: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10B981', // emerald-600
  },
});
