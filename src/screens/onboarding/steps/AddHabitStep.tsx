/**
 * AddHabitStep — Browse templates by category or create a custom habit.
 * Step 0 of the interactive onboarding flow.
 */

import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';

import { useThemeColors } from '../../../theme/ThemeContext';
import { MiniTemplateCard } from '../../../components/MiniTemplateCard/MiniTemplateCard';
import { CreateHabitModalCentered } from '../../../components/CreateHabitModal';
import { OnboardingHeader } from '../components/OnboardingHeader';
import { CategoryPills } from '../components/CategoryPills';
import type { AddHabitStepProps, CategoryPillData } from '../onboarding.types';
import {
  useCustomHabitDetection,
  useImportTemplate,
  useTemplatesByCategory,
} from './AddHabitStep.hooks';
import { styles } from './AddHabitStep.styles';

export function AddHabitStep({ onHabitCreated, onSkip }: AddHabitStepProps) {
  const { colors } = useThemeColors();
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryPillData['category']>('popular');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const templates = useTemplatesByCategory(selectedCategory);
  const { handleImport, importingId } = useImportTemplate(onHabitCreated);
  const { markModalOpened } = useCustomHabitDetection(onHabitCreated);

  return (
    <View style={styles.container}>
      <OnboardingHeader
        subtitle="Pick one to get started — you can always add more later."
        title="Let's add your first habit"
      />
      <CategoryPills
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
      {!templates ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary[600]} />
        </View>
      ) : (
        <FlatList
          data={templates}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <MiniTemplateCard
              description={item.description}
              hasResearch={!!item.scientificReference}
              icon={item.icon}
              iconColor={item.iconColor ?? '#059669'}
              index={index}
              isImported={false}
              isImporting={importingId === item._id}
              name={item.name}
              subtitle={item.frequency}
              onImport={() => void handleImport(item._id)}
              onPress={() => void handleImport(item._id)}
            />
          )}
          contentContainerStyle={styles.templateGridContent}
          showsVerticalScrollIndicator={false}
          style={styles.templateGrid}
        />
      )}
      <View style={styles.footer}>
        <Pressable
          accessibilityLabel="Create a custom habit"
          accessibilityRole="button"
          hitSlop={16}
          onPress={() => {
            markModalOpened();
            setShowCreateModal(true);
          }}
        >
          <Text style={[styles.createOwnLink, { color: colors.primary[600] }]}>
            Or create your own
          </Text>
        </Pressable>
      </View>
      <CreateHabitModalCentered
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </View>
  );
}
