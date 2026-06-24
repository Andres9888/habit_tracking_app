/** TrialCard — gold free-trial conversion card under the profile hero */
import { Text, View } from 'react-native';
import { Crown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { shadows } from '@/theme';
import { airy } from '@/theme/airyScale';
import { colors } from '@/theme/colors';
import { typography, fontWeights } from '@/theme/typography';
import { AnimatedPressable } from '../../ui/AnimatedPressable';

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
  const trialLine =
    daysLeft > 0
      ? `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left in your free trial`
      : 'Your free trial is ending soon';
  const cta = priceString ? `Upgrade — ${priceString}/mo` : 'Upgrade';

  return (
    <View
      className='overflow-hidden rounded-2xl p-4'
      style={{
        backgroundColor: colors.streak[100],
        borderColor: `${colors.streak[700]}33`,
        borderRadius: airy.cardRadius,
        borderWidth: 1,
        ...shadows.card,
      }}
    >
      <View className='flex-row items-center' style={{ gap: 14 }}>
        <View
          className='h-11 w-11 items-center justify-center rounded-xl'
          style={{ backgroundColor: colors.streak[700] }}
        >
          <Crown color='#FFFFFF' size={iconSizes.medium} />
        </View>
        <View className='flex-1'>
          <Text
            style={{
              ...typography.body,
              fontWeight: fontWeights.bold,
              color: colors.gray[800],
            }}
          >
            Chain Day Pro
          </Text>
          <Text
            className='mt-0.5'
            style={{
              ...typography.caption,
              fontWeight: fontWeights.semibold,
              color: colors.streak[700],
            }}
          >
            {trialLine}
          </Text>
        </View>
      </View>
      <Text
        className='mt-3'
        style={{
          ...typography.bodySmall,
          color: colors.gray[600],
          lineHeight: 19,
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
          className='mt-4 items-center rounded-xl py-3'
          style={{ backgroundColor: colors.primary[600] }}
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
