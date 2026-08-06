import { useQuery } from 'convex/react';
import * as Notifications from 'expo-notifications';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { api } from '../../../../convex/_generated/api';
import { HeroHeader } from '../components/HeroHeader';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { StepComponentProps } from '../types';

function joinNames(names: string[]): string {
  if (names.length === 0) return 'the habits you picked';
  if (names.length === 1) return names[0] ?? '';
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

export function NotificationPrimingStep({ answers, onNext }: StepComponentProps) {
  const { colors } = useThemeColors();
  const [busy, setBusy] = useState(false);
  const all = useQuery(api.templates.list, {});
  const names = all
    ? answers.pickedTemplateIds
        .map((id) => all.find((t) => t._id === id)?.name)
        .filter((n): n is string => Boolean(n))
    : [];

  const enable = async () => {
    setBusy(true);
    try {
      await Notifications.requestPermissionsAsync();
    } catch {}
    setBusy(false);
    onNext();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <View>
        <HeroHeader
          headline="One nudge. At the times you choose."
          sub={`For your ${joinNames(names)}. Nothing else. You can turn them off anytime in Settings.`}
        />
      </View>
      <View style={{ paddingTop: 12 }}>
        <PrimaryCTA
          disabled={busy}
          label={busy ? 'One moment…' : 'Turn on reminders'}
          onPress={() => void enable()}
          variant="brand"
        />
        <Pressable
          accessibilityRole="button"
          hitSlop={10}
          onPress={onNext}
          style={{ alignItems: 'center', padding: 14 }}
        >
          <Text style={{ color: colors.text.secondary, fontSize: 14 }}>
            Not now — I&rsquo;ll do this later
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
