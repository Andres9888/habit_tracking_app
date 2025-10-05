import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export type HabitViewType = 'list' | 'detailed' | 'compact';

interface HabitViewSelectorProps {
  currentView: HabitViewType;
  onViewChange: (view: HabitViewType) => void;
}

export default function HabitViewSelector({ currentView, onViewChange }: HabitViewSelectorProps) {
  const views = [
    { key: 'list' as HabitViewType, label: 'List' },
    { key: 'detailed' as HabitViewType, label: 'Details' },
    { key: 'compact' as HabitViewType, label: 'Quick' },
  ];

  return (
    <View style={styles.container}>
      {views.map((view) => (
        <TouchableOpacity
          key={view.key}
          onPress={() => onViewChange(view.key)}
          style={[
            styles.viewOption,
            currentView === view.key && styles.viewOptionActive
          ]}
          accessibilityLabel={`Switch to ${view.label} view`}
          accessibilityRole="button"
        >
          <Text style={[
            styles.viewOptionText,
            currentView === view.key && styles.viewOptionTextActive
          ]}>
            {view.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 4,
    gap: 2,
  },
  viewOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewOptionActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  viewOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
  },
  viewOptionTextActive: {
    color: '#0f172a',
    fontWeight: '600',
  },
});