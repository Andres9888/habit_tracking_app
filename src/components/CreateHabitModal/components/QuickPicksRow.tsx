import { useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
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
    color: '#8B5CF6',
    emoji: '🧘',
    id: 'meditate',
    name: 'Meditate', // Purple
    timeOfDay: 'phase1_push',
  },
  {
    color: '#3B82F6',
    emoji: '📖',
    id: 'read',
    name: 'Read', // Blue
    timeOfDay: 'phase3_pull',
  },
  {
    color: '#22C55E',
    emoji: '💪',
    id: 'exercise',
    name: 'Exercise', // Green
    timeOfDay: 'phase1_push',
  },
  {
    color: '#06B6D4',
    emoji: '💧',
    id: 'hydrate',
    name: 'Hydrate', // Cyan
    timeOfDay: 'phase1_push',
  },
  {
    color: '#F97316',
    emoji: '✍️',
    id: 'journal',
    name: 'Journal', // Orange
    timeOfDay: 'phase3_pull',
  },
];

interface QuickPickCardProps {
  template: QuickPickTemplate;
  isSelected: boolean;
  onPress: () => void;
}

const QuickPickCard = ({
  template,
  isSelected,
  onPress,
}: QuickPickCardProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const phaseInfo = HUBERMAN_PHASES[template.timeOfDay];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      friction: 10,
      tension: 300,
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      friction: 10,
      tension: 300,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      accessibilityLabel={`Quick pick: ${template.name}`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className='mr-3 overflow-hidden rounded-2xl bg-white p-3'
        style={[
          {
            borderColor: isSelected ? '#22C55E' : '#e7e5e4',
            borderWidth: 2,
            minWidth: 100,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Emoji with gradient background */}
        <View
          className='mb-2 h-12 w-12 items-center justify-center self-center rounded-xl'
          style={{ backgroundColor: template.color }}
        >
          <Text className='text-2xl'>{template.emoji}</Text>
        </View>

        {/* Name */}
        <Text className='mb-1 text-center text-sm font-semibold text-stone-800'>
          {template.name}
        </Text>

        {/* Timing subtitle */}
        <Text className='text-center text-xs text-stone-500'>
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
      isSelected={selectedTemplateId === item.id}
      template={item}
      onPress={() => handleSelectTemplate(item)}
    />
  );

  return (
    <View className='mb-4'>
      {/* Header row */}
      <View className='mb-3 flex-row items-center justify-between px-1'>
        <Text className='text-base font-semibold text-stone-800'>
          Quick picks
        </Text>
        {onBrowseAll && (
          <Pressable
            accessibilityLabel='Browse all templates'
            accessibilityRole='button'
            onPress={() => {
              triggerSelection();
              onBrowseAll();
            }}
          >
            <Text className='text-sm font-medium text-[#22C55E]'>
              Browse all →
            </Text>
          </Pressable>
        )}
      </View>

      {/* Template cards */}
      <FlatList
        horizontal
        contentContainerStyle={{ paddingHorizontal: 1 }}
        data={QUICK_PICK_TEMPLATES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export { QUICK_PICK_TEMPLATES };
