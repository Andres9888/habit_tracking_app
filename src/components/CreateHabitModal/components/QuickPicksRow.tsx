import { useRef } from 'react';
import { AccessibilityInfo, Animated, FlatList, Pressable, Text, View } from 'react-native';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import type { HubermanPhase } from '../../../constants/hubermanPhases';
import { HUBERMAN_PHASES } from '../../../constants/hubermanPhases';

export interface QuickPickTemplate {
  id: string;
  name: string;
  emoji: string;
  color: string;
  timeOfDay: HubermanPhase;
}

const QUICK_PICK_TEMPLATES: QuickPickTemplate[] = [
  {
    id: 'meditate',
    name: 'Meditate',
    emoji: '🧘',
    color: '#8B5CF6', // Purple
    timeOfDay: 'phase1_push',
  },
  {
    id: 'read',
    name: 'Read',
    emoji: '📖',
    color: '#3B82F6', // Blue
    timeOfDay: 'phase3_pull',
  },
  {
    id: 'exercise',
    name: 'Exercise',
    emoji: '💪',
    color: '#22C55E', // Green
    timeOfDay: 'phase1_push',
  },
  {
    id: 'hydrate',
    name: 'Hydrate',
    emoji: '💧',
    color: '#06B6D4', // Cyan
    timeOfDay: 'phase1_push',
  },
  {
    id: 'journal',
    name: 'Journal',
    emoji: '✍️',
    color: '#F97316', // Orange
    timeOfDay: 'phase3_pull',
  },
];

interface QuickPickCardProps {
  template: QuickPickTemplate;
  isSelected: boolean;
  onPress: () => void;
}

const QuickPickCard = ({ template, isSelected, onPress }: QuickPickCardProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const phaseInfo = HUBERMAN_PHASES[template.timeOfDay];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityLabel={`Quick pick: ${template.name}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
    >
      <Animated.View
        className="mr-3 overflow-hidden rounded-2xl bg-white p-3"
        style={[
          {
            minWidth: 100,
            borderWidth: 2,
            borderColor: isSelected ? '#22C55E' : '#e7e5e4',
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Emoji with gradient background */}
        <View
          className="mb-2 h-12 w-12 items-center justify-center self-center rounded-xl"
          style={{ backgroundColor: template.color }}
        >
          <Text className="text-2xl">{template.emoji}</Text>
        </View>

        {/* Name */}
        <Text className="mb-1 text-center text-sm font-semibold text-[#1a1a1a]">
          {template.name}
        </Text>

        {/* Timing subtitle */}
        <Text className="text-center text-xs text-[#78716c]">
          {phaseInfo.icon} {phaseInfo.shortLabel}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

interface QuickPicksRowProps {
  selectedTemplateId: string | null;
  onSelectTemplate: (template: QuickPickTemplate) => void;
  onBrowseAll?: () => void;
}

export const QuickPicksRow = ({
  selectedTemplateId,
  onSelectTemplate,
  onBrowseAll,
}: QuickPicksRowProps) => {
  const { triggerSelection } = useHapticFeedback();

  const handleSelectTemplate = (template: QuickPickTemplate) => {
    triggerSelection();
    onSelectTemplate(template);
    // Announce template selection for screen readers
    const phaseInfo = HUBERMAN_PHASES[template.timeOfDay];
    AccessibilityInfo.announceForAccessibility(
      `Selected ${template.name} template. Scheduled for ${phaseInfo.shortLabel}`
    );
  };

  const renderItem = ({ item }: { item: QuickPickTemplate }) => (
    <QuickPickCard
      template={item}
      isSelected={selectedTemplateId === item.id}
      onPress={() => handleSelectTemplate(item)}
    />
  );

  return (
    <View className="mb-4">
      {/* Header row */}
      <View className="mb-3 flex-row items-center justify-between px-1">
        <Text className="text-base font-semibold text-[#1a1a1a]">Quick picks</Text>
        {onBrowseAll && (
          <Pressable
            onPress={() => {
              triggerSelection();
              onBrowseAll();
            }}
            accessibilityLabel="Browse all templates"
            accessibilityRole="button"
          >
            <Text className="text-sm font-medium text-[#22C55E]">Browse all →</Text>
          </Pressable>
        )}
      </View>

      {/* Template cards */}
      <FlatList
        horizontal
        data={QUICK_PICK_TEMPLATES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 1 }}
      />
    </View>
  );
};

export { QUICK_PICK_TEMPLATES };
