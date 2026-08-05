import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { DemoCard } from '../components/DemoCard';
import { HeroHeader } from '../components/HeroHeader';
import { useDemoTemplates } from '../useDemoTemplates';
import { StepComponentProps } from '../types';

const TARGET_KEEP = 3;

export function AppDemoStep({ answers, onAnswerChange, onNext }: StepComponentProps) {
  const { colors } = useThemeColors();
  const templates = useDemoTemplates(answers.categories);
  const [index, setIndex] = useState(0);
  const kept = answers.pickedTemplateIds;
  const current = templates?.[index];
  const outOfTemplates = Boolean(templates) && !current;

  useEffect(() => {
    if (outOfTemplates) onNext();
  }, [outOfTemplates, onNext]);

  if (!templates || !current) {
    return (
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary[600]} />
      </View>
    );
  }

  const respond = (keep: boolean) => {
    if (keep && kept.length < TARGET_KEEP) {
      const nextKept = [...kept, current._id];
      onAnswerChange({ pickedTemplateIds: nextKept });
      if (nextKept.length >= TARGET_KEEP) {
        onNext();
        return;
      }
    }
    setIndex(index + 1);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <View>
        <HeroHeader
          eyebrow={`Kept ${kept.length} / ${TARGET_KEEP}`}
          headline="Swipe through. Keep the ones that feel right."
          sub={`You can change these later. Pick ${TARGET_KEEP - kept.length} more.`}
        />
        <View style={{ marginTop: 20 }}>
          <DemoCard template={current} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 12, paddingTop: 12 }}>
        <Pressable
          accessibilityRole="button"
          onPress={() => respond(false)}
          style={{
            alignItems: 'center',
            backgroundColor: colors.border,
            borderRadius: 14,
            flex: 1,
            padding: 16,
          }}
        >
          <Text style={{ color: colors.text.primary, fontSize: 15, fontWeight: '600' }}>Skip</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => respond(true)}
          style={{
            alignItems: 'center',
            backgroundColor: colors.primary[600],
            borderRadius: 14,
            flex: 1,
            padding: 16,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '600' }}>Keep</Text>
        </Pressable>
      </View>
    </View>
  );
}
