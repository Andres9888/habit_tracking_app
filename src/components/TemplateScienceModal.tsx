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

interface TemplateScienceModalProps {
  visible: boolean;
  onClose: () => void;
  template: any | null;
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
      visible={visible}
      onClose={onClose}
      variant="fullScreen"
      disableBackdropClose={false}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityLabel="Close science modal"
            accessibilityRole="button"
            style={styles.closeButton}
            onPress={onClose}
          >
            <X color="#1a1a1a" size={24} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontFamily: theme.custom.fontFamilies.primary.text }]}>
            Template Details
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
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
            <Text style={[styles.templateName, { fontFamily: theme.custom.fontFamilies.primary.text }]}>
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
            <Text style={[styles.sectionTitle, { fontFamily: theme.custom.fontFamilies.primary.text }]}>
              About This Habit
            </Text>
            <Text style={[styles.descriptionText, { fontFamily: theme.custom.fontFamilies.primary.text }]}>
              {template.description}
            </Text>
          </View>

          {/* Scientific Research Section */}
          <View style={[styles.section, styles.scienceSection]}>
            <View style={styles.scienceHeader}>
              <Text style={styles.scienceEmoji}>🔬</Text>
              <Text style={[styles.sectionTitle, { fontFamily: theme.custom.fontFamilies.primary.text }]}>
                Scientific Backing
              </Text>
            </View>

            <View style={styles.researchBox}>
              {/* Research Citation */}
              <View style={styles.citationContainer}>
                <Text style={[styles.citationLabel, { fontFamily: theme.custom.fontFamilies.primary.text }]}>
                  Research Citation
                </Text>
                <Text style={[styles.citationText, { fontFamily: theme.custom.fontFamilies.primary.text }]}>
                  {template.scientificReference}
                </Text>
              </View>

              {/* Research Link (if available) */}
              {template.scientificLink && (
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={handleLinkPress}
                  accessibilityRole="button"
                  accessibilityLabel="Open research paper"
                >
                  <ExternalLink color="#3B82F6" size={18} />
                  <Text style={[styles.linkText, { fontFamily: theme.custom.fontFamilies.primary.text }]}>
                    Read Full Research Paper
                  </Text>
                </TouchableOpacity>
              )}

              {/* Why It Works */}
              <View style={styles.whyItWorksContainer}>
                <Text style={[styles.whyItWorksTitle, { fontFamily: theme.custom.fontFamilies.primary.text }]}>
                  Why This Habit Works
                </Text>
                <Text style={[styles.whyItWorksText, { fontFamily: theme.custom.fontFamilies.primary.text }]}>
                  {getWhyItWorksText(template)}
                </Text>
              </View>
            </View>
          </View>

          {/* Frequency Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontFamily: theme.custom.fontFamilies.primary.text }]}>
              Recommended Frequency
            </Text>
            <View style={styles.frequencyBadge}>
              <Text style={[styles.frequencyText, { fontFamily: theme.custom.fontFamilies.primary.text }]}>
                {template.frequency.charAt(0).toUpperCase() + template.frequency.slice(1)}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={onUseTemplate}
            style={styles.useButton}
          >
            Use This Template
          </Button>
          <Button
            variant="ghost"
            size="medium"
            fullWidth
            onPress={onClose}
            style={styles.backButton}
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
function getWhyItWorksText(template: any): string {
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

  if (name.includes('exercise') || name.includes('workout') || name.includes('fitness')) {
    return 'Regular physical activity triggers the release of endorphins, improves cardiovascular health, strengthens muscles and bones, and enhances cognitive function. The cumulative effect of consistent exercise leads to significant improvements in both physical and mental well-being.';
  }

  if (name.includes('gratitude') || name.includes('journal')) {
    return 'Gratitude practices rewire the brain to focus on positive experiences, which improves mood, increases life satisfaction, and strengthens social relationships. Regular journaling creates a lasting shift in psychological well-being by training attention toward positive aspects of life.';
  }

  if (name.includes('sleep') || name.includes('sunlight') || name.includes('sunrise')) {
    return 'Light exposure, particularly natural sunlight in the morning, is the primary zeitgeber (time-giver) for the circadian system. It helps regulate cortisol awakening response, improves alertness, mood, and sets the stage for better sleep quality at night.';
  }

  if (category === 'productivity') {
    return 'Research demonstrates that structured work approaches reduce decision fatigue, minimize distractions, and optimize cognitive resources. By establishing clear boundaries and focused work periods, productivity increases while mental exhaustion decreases.';
  }

  // Default explanation
  return 'Scientific research has consistently demonstrated the effectiveness of this habit pattern. Regular practice leads to measurable improvements in the targeted area through both physiological adaptations and behavioral reinforcement mechanisms.';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f5f1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  templateHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: 16,
  },
  iconText: {
    fontSize: 40,
  },
  templateName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4b5563',
  },
  scienceSection: {
    marginBottom: 32,
  },
  scienceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scienceEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  researchBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  citationContainer: {
    marginBottom: 16,
  },
  citationLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  citationText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1a1a1a',
    fontStyle: 'italic',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    marginBottom: 16,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B82F6',
  },
  whyItWorksContainer: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  whyItWorksTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  whyItWorksText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#4b5563',
  },
  frequencyBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  frequencyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e40af',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 24,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    gap: 12,
  },
  useButton: {
    marginBottom: 4,
  },
  backButton: {
    marginTop: 0,
  },
});
