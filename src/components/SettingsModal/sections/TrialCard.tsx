/** TrialCard — gold free-trial conversion card under the profile hero */
import { Text, View } from 'react-native';
import { shadows } from '@/theme';
import { airy } from '@/theme/airyScale';
import { colors } from '@/theme/colors';
import { typography, fontWeights } from '@/theme/typography';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { useSettingsScale } from '../useSettingsScale';
import { TrialCardHeader } from './TrialCardHeader';

interface TrialCardProps {
  daysLeft: number;
  priceString: string | null;
  onUpgrade?: () => void;
}

export function TrialCard({
  daysLeft,
  priceString,
  onUpgrade,
}: TrialCardProps) {
  const k = useSettingsScale();
  const trialLine =
    daysLeft > 0
      ? `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left in your free trial`
      : 'Your free trial is ending soon';
  const cta = priceString ? `Upgrade — ${priceString}/mo` : 'Upgrade';

  return (
    <View
      className='overflow-hidden rounded-2xl'
      style={{
        backgroundColor: colors.streak[100],
        borderColor: `${colors.streak[700]}33`,
        borderRadius: airy.cardRadius,
        borderWidth: 1,
        padding: k(15),
        ...shadows.card,
      }}
    >
      <TrialCardHeader trialLine={trialLine} />
      <Text
        className='mt-3'
        style={{
          ...typography.bodySmall,
          fontSize: k(13),
          color: colors.gray[600],
          lineHeight: k(18),
        }}
      >
        Keep unlimited habits, custom reminders, and every theme when your trial
        ends.
      </Text>
      <AnimatedPressable
        accessibilityLabel={cta}
        accessibilityRole='button'
        onPress={onUpgrade}
      >
        <View
          className='mt-4 items-center'
          style={{
            backgroundColor: colors.primary[600],
            paddingVertical: k(11),
            borderRadius: 11,
          }}
        >
          <Text
            style={{
              ...typography.body,
              fontWeight: fontWeights.bold,
              color: '#FFFFFF',
            }}
          >
            {cta}
          </Text>
        </View>
      </AnimatedPressable>
    </View>
  );
}
