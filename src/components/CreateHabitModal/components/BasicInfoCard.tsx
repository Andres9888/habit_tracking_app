import { memo } from 'react';
import { Text, View } from 'react-native';
import { Edit3, CheckCircle, Circle } from 'lucide-react-native';
import { CompletionBadge } from './CompletionBadge';
import { HabitNameField } from './HabitNameField';

/**
 * Props for BasicInfoCard component
 */
interface BasicInfoCardProps {
  /** Current habit name value */
  habitName: string;
  /** Callback when habit name changes */
  onHabitNameChange: (name: string) => void;
  /** Whether this section is complete (habitName.trim().length > 0) */
  isComplete: boolean;
  /** Whether the input should auto-focus */
  autoFocus?: boolean;
}

/**
 * Card wrapper for Basic Info section (habit name input)
 *
 * Features:
 * - Card header with Edit3 icon, "BASIC INFO" title, and completion state
 * - Required badge
 * - Checkmark when complete (habitName non-empty)
 * - Integrates HabitNameField component with character counter
 *
 * @component
 * @example
 * ```tsx
 * <BasicInfoCard
 *   habitName="Read for 20 minutes"
 *   onHabitNameChange={setHabitName}
 *   isComplete={habitName.trim().length > 0}
 *   autoFocus
 * />
 * ```
 */
const BasicInfoCardComponent = ({
  habitName,
  onHabitNameChange,
  isComplete,
  autoFocus = false,
}: BasicInfoCardProps) => {
  return (
    <View
      className="mb-5 rounded-2xl bg-white p-4 shadow-sm"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      {/* Card Header */}
      <View className="mb-4 flex-row items-center justify-between">
        {/* Left side: Icon + Title */}
        <View className="flex-row items-center gap-2">
          <Edit3 color="#10B981" size={18} strokeWidth={2} />
          <Text className="text-sm font-bold uppercase tracking-wide text-stone-900">
            Basic Info
          </Text>
        </View>

        {/* Right side: Badge + Completion State */}
        <View className="flex-row items-center gap-2">
          <CompletionBadge type="required" />
          {isComplete ? (
            <CheckCircle
              accessibilityLabel="Section complete"
              color="#10B981"
              size={20}
              strokeWidth={2}
            />
          ) : (
            <Circle
              accessibilityLabel="Section incomplete"
              color="#D6D3D1"
              size={20}
              strokeWidth={2}
            />
          )}
        </View>
      </View>

      {/* Content: Habit Name Field */}
      <HabitNameField
        autoFocus={autoFocus}
        showCharacterCount
        value={habitName}
        onChange={onHabitNameChange}
      />
    </View>
  );
};

/**
 * Memoized BasicInfoCard component for performance optimization
 */
export const BasicInfoCard = memo(BasicInfoCardComponent);
