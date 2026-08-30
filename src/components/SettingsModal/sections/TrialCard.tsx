/** TrialCard — free-trial conversion card under the profile hero.
 *
 *  Themed, not hardcoded. This used to import the STATIC palette
 *  (colors.streak[100] / gray[800] / gray[600]), so in dark mode the single
 *  highest-intent surface in the app rendered as a pale mint slab carrying
 *  near-black text on a #111827 canvas. */
import { Text, View } from 'react-native';
import { airy } from '@/theme/airyScale';
import { typography, fontWeights } from '@/theme/typography';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';
import { getRaisedSurface, settingsCardShadow } from '../raisedSurface';
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
  const { colors: themeColors, isDark } = useThemeColors();
  const trialLine =
    daysLeft > 0
      ? `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left in your free trial`
      : 'Your free trial is ending soon';
  const cta = priceString ? `Upgrade — ${priceString}/mo` : 'Upgrade';

  return (
    <View
      className='overflow-hidden p-4'
      style={{
        backgroundColor: getRaisedSurface(isDark),
        borderColor: themeColors.status.warning,
        borderRadius: airy.cardRadius,
        borderWidth: 1,
        ...settingsCardShadow,
      }}
    >
      <TrialCardHeader trialLine={trialLine} />
      <Text
        className='mt-3'
        style={{
          ...typography.bodySmall,
          color: themeColors.text.secondary,
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
          className='mt-4 items-center py-3'
          style={{
            backgroundColor: themeColors.primary[600],
            borderRadius: airy.buttonRadius,
          }}
        >
          <Text
            style={{
              ...typography.body,
              fontWeight: fontWeights.bold,
              color: themeColors.text.inverse,
            }}
          >
            {cta}
          </Text>
        </View>
      </AnimatedPressable>
    </View>
  );
}
