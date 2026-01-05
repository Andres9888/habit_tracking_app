import { Pressable, Switch, Text, View } from 'react-native';
import { Bell } from 'lucide-react-native';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

interface MinimalReminderToggleProps {
  enabled: boolean;
  time: string;
  onToggle: (value: boolean) => void;
  onTimePress?: () => void;
}

/**
 * Minimal reminder toggle matching the centered modal design
 *
 * Features:
 * - Single row with bell icon, label, time, and toggle
 * - Yellow/amber accent colors matching the mock
 * - Time displayed in green when enabled
 * - Tapping time text opens time picker
 * - Clean card with subtle border and shadow
 */
export const MinimalReminderToggle = ({
  enabled,
  time,
  onToggle,
  onTimePress,
}: MinimalReminderToggleProps) => {
  const { triggerSelection } = useHapticFeedback();

  return (
    <View
      className="flex-row items-center justify-between rounded-xl border border-stone-200 bg-white px-3.5 py-3.5"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      {/* Icon + Label Section */}
      <View className="flex-1 flex-row items-center gap-3">
        {/* Bell Icon in amber circle */}
        <View className="h-9 w-9 items-center justify-center rounded-full bg-amber-100">
          <Bell color="#f59e0b" size={16} />
        </View>

        {/* Label and Time */}
        <View className="flex-1">
          <Text className="text-sm font-medium text-stone-900">Remind me</Text>
          <Pressable
            onPress={() => {
              if (enabled && onTimePress) {
                triggerSelection();
                onTimePress();
              }
            }}
            disabled={!enabled}
          >
            <Text
              className={`text-xs font-medium ${
                enabled ? 'text-emerald-500' : 'text-stone-400'
              }`}
            >
              {enabled ? time : 'Off'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Toggle Switch */}
      <Switch
        accessibilityLabel={enabled ? 'Disable reminder' : 'Enable reminder'}
        accessibilityRole="switch"
        ios_backgroundColor="#d6d3d1"
        thumbColor="#ffffff"
        trackColor={{ false: '#d6d3d1', true: '#10B981' }}
        value={enabled}
        onValueChange={(val) => {
          triggerSelection();
          onToggle(val);
        }}
      />
    </View>
  );
};
