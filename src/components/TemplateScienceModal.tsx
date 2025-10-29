/**
 * Template Science Modal Component
 * Displays detailed scientific research and backing for habit templates
 *
 * Features:
 * - Full-screen modal with template details
 * - Scientific research section with citations
 * - Tappable research links
 * - Actions: Use Template or Back to Templates
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { X, ExternalLink } from 'lucide-react-native';
import Modal from './Modal';
import Button from './Button';
import { useAppTheme } from '../theme';
import type { Doc } from '../../convex/_generated/dataModel';

interface TemplateScienceModalProps {
  visible: boolean;
  onClose: () => void;
  template: Doc<'templates'> | null;
  onUseTemplate: () => void;
}

export default function TemplateScienceModal({
  visible,
  onClose,
  template,
  onUseTemplate,
}: TemplateScienceModalProps) {
  const theme = useAppTheme();

  if (!template) {
    return null;
  }

  const handleLinkPress = async () => {
    if (template.scientificLink) {
      const canOpen = await Linking.canOpenURL(template.scientificLink);
      if (canOpen) {
        await Linking.openURL(template.scientificLink);
      }
    }
  };

  return (
    <Modal
      disableBackdropClose={false}
      variant='fullScreen'
      visible={visible}
      onClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityLabel='Close science modal'
            accessibilityRole='button'
            style={styles.closeButton}
            onPress={onClose}
          >
            <X color='#1a1a1a' size={24} strokeWidth={2} />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              { fontFamily: theme.custom.fontFamilies.primary.text },
            ]}
          >
            Template Details
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          style={styles.content}
        >
          {/* Template Icon and Name */}
          <View style={styles.templateHeader}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: template.iconColor + '30' },
              ]}
            >
              <Text style={styles.iconText}>{template.icon}</Text>
            </View>
            <Text
              style={[
                styles.templateName,
                { fontFamily: theme.custom.fontFamilies.primary.text },
              ]}
            >
              {template.name}
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {template.category.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Full Description */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { fontFamily: theme.custom.fontFamilies.primary.text },
              ]}
            >
              About This Habit
            </Text>
            <Text
              style={[
                styles.descriptionText,
                { fontFamily: theme.custom.fontFamilies.primary.text },
              ]}
            >
              {template.description}
            </Text>
          </View>

          {/* Scientific Research Section */}
          <View style={[styles.section, styles.scienceSection]}>
            <View style={styles.scienceHeader}>
              <Text style={styles.scienceEmoji}>🔬</Text>
              <Text
                style={[
                  styles.sectionTitle,
                  { fontFamily: theme.custom.fontFamilies.primary.text },
                ]}
              >
                Scientific Backing
              </Text>
            </View>

            <View style={styles.researchBox}>
              {/* Research Citation */}
              <View style={styles.citationContainer}>
                <Text
                  style={[
                    styles.citationLabel,
                    { fontFamily: theme.custom.fontFamilies.primary.text },
                  ]}
                >
                  Research Citation
                </Text>
                <Text
                  style={[
                    styles.citationText,
                    { fontFamily: theme.custom.fontFamilies.primary.text },
                  ]}
                >
                  {template.scientificReference}
                </Text>
              </View>

              {/* Research Link (if available) */}
              {template.scientificLink && (
                <TouchableOpacity
                  accessibilityLabel='Open research paper'
                  accessibilityRole='button'
                  style={styles.linkButton}
                  onPress={handleLinkPress}
                >
                  <ExternalLink color='#3B82F6' size={18} />
                  <Text
                    style={[
                      styles.linkText,
                      { fontFamily: theme.custom.fontFamilies.primary.text },
                    ]}
                  >
                    Read Full Research Paper
                  </Text>
                </TouchableOpacity>
              )}

              {/* Why It Works */}
              <View style={styles.whyItWorksContainer}>
                <Text
                  style={[
                    styles.whyItWorksTitle,
                    { fontFamily: theme.custom.fontFamilies.primary.text },
                  ]}
                >
                  Why This Habit Works
                </Text>
                <Text
                  style={[
                    styles.whyItWorksText,
                    { fontFamily: theme.custom.fontFamilies.primary.text },
                  ]}
                >
                  {getWhyItWorksText(template)}
                </Text>
              </View>
            </View>
          </View>

          {/* Frequency Info */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { fontFamily: theme.custom.fontFamilies.primary.text },
              ]}
            >
              Recommended Frequency
            </Text>
            <View style={styles.frequencyBadge}>
              <Text
                style={[
                  styles.frequencyText,
                  { fontFamily: theme.custom.fontFamilies.primary.text },
                ]}
              >
                {template.frequency.charAt(0).toUpperCase() +
                  template.frequency.slice(1)}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <Button
            fullWidth
            size='large'
            style={styles.useButton}
            variant='primary'
            onPress={onUseTemplate}
          >
            Use This Template
          </Button>
          <Button
            fullWidth
            size='medium'
            style={styles.backButton}
            variant='ghost'
            onPress={onClose}
          >
            Back to Templates
          </Button>
        </View>
      </View>
    </Modal>
  );
}

/**
 * Helper function to generate "Why It Works" text based on template data
 */
function getWhyItWorksText(template: Doc<'templates'>): string {
  // This is a simple implementation. In a real app, you might store this in the database
  // or use AI to generate it based on the research
  const category = template.category;
  const name = template.name.toLowerCase();

  // Generate contextual explanation based on category and name
  if (name.includes('meditation') || name.includes('mindfulness')) {
    return 'Regular meditation practice has been shown to reduce stress hormones, improve emotional regulation, and increase gray matter density in brain regions associated with learning and memory. Even brief daily sessions create lasting neurological changes.';
  }

  if (name.includes('water') || name.includes('hydration')) {
    return 'Proper hydration is essential for cognitive function, physical performance, and metabolic processes. Morning hydration is particularly important as the body is naturally dehydrated after 7-8 hours of sleep, and starting the day with water helps restore optimal function.';
  }

  if (
    name.includes('exercise') ||
    name.includes('workout') ||
    name.includes('fitness')
  ) {
    return 'Regular physical activity triggers the release of endorphins, improves cardiovascular health, strengthens muscles and bones, and enhances cognitive function. The cumulative effect of consistent exercise leads to significant improvements in both physical and mental well-being.';
  }

  if (name.includes('gratitude') || name.includes('journal')) {
    return 'Gratitude practices rewire the brain to focus on positive experiences, which improves mood, increases life satisfaction, and strengthens social relationships. Regular journaling creates a lasting shift in psychological well-being by training attention toward positive aspects of life.';
  }

  if (
    name.includes('sleep') ||
    name.includes('sunlight') ||
    name.includes('sunrise')
  ) {
    return 'Light exposure, particularly natural sunlight in the morning, is the primary zeitgeber (time-giver) for the circadian system. It helps regulate cortisol awakening response, improves alertness, mood, and sets the stage for better sleep quality at night.';
  }

  if (category === 'productivity') {
    return 'Research demonstrates that structured work approaches reduce decision fatigue, minimize distractions, and optimize cognitive resources. By establishing clear boundaries and focused work periods, productivity increases while mental exhaustion decreases.';
  }

  // Default explanation
  return 'Scientific research has consistently demonstrated the effectiveness of this habit pattern. Regular practice leads to measurable improvements in the targeted area through both physiological adaptations and behavioral reinforcement mechanisms.';
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  container: {
    backgroundColor: '#f8f5f1',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    borderRadius: 12,
    paddingVertical: 6,
  },
  content: {
    flex: 1,
  },
  categoryText: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  contentContainer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  descriptionText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    borderBottomColor: '#e5e5e5',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 20,
    height: 80,
    justifyContent: 'center',
    marginBottom: 16,
    width: 80,
  },
  iconText: {
    fontSize: 40,
  },
  citationContainer: {
    marginBottom: 16,
  },
  researchBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 20,
  },
  citationLabel: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  scienceHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  citationText: {
    color: '#1a1a1a',
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  templateHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  linkButton: {
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  frequencyBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  templateName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopColor: '#e5e5e5',
    borderTopWidth: 1,
    gap: 12,
  },
  section: {
    marginBottom: 28,
  },
  backButton: {
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  frequencyText: {
    color: '#1e40af',
    fontSize: 15,
    fontWeight: '600',
  },
  scienceSection: {
    marginBottom: 32,
  },
  linkText: {
    color: '#3B82F6',
    fontSize: 15,
    fontWeight: '600',
  },
  scienceEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  useButton: {
    marginBottom: 4,
  },
  whyItWorksContainer: {
    backgroundColor: '#f9fafb',
    borderLeftColor: '#10B981',
    borderLeftWidth: 3,
    borderRadius: 12,
    padding: 16,
  },
  whyItWorksText: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 21,
  },
  whyItWorksTitle: {
    color: '#1a1a1a',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
});
