/** PremiumActiveCard — quiet status card for active subscribers.
 *
 *  Section title is 'Subscription' in BOTH states (see FreePlanCard): the page
 *  used to rename its own section depending on who was looking at it. The
 *  status badge is the shared ProfilePremiumBadge, so premium reads the same
 *  amber here as it does on the profile hero one screen back — it previously
 *  rendered green-on-amber here and amber-on-amber there. */
import { Text, View } from 'react-native';
import { Crown, Settings } from 'lucide-react-native';
import { airy } from '@/theme/airyScale';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { ProfilePremiumBadge } from '../ProfilePremiumBadge';
import { useThemeColors } from '../../../theme/ThemeContext';
import { AnnualUpgradeRow } from './AnnualUpgradeRow';
import { handleManageSubscription } from './PremiumStatus.helpers';

interface PremiumActiveCardProps {
  onUpgrade?: () => void;
}

export function PremiumActiveCard({ onUpgrade }: PremiumActiveCardProps) {
  const { colors: themeColors, settings } = useThemeColors();

  return (
    <SettingsSection title='Subscription'>
      <View className='flex-row items-center px-4 py-4'>
        {/* Same tile geometry as every SettingsRow — this was hand-rolled at
            40×40 rounded-xl, 2px short of the shared token. */}
        <View
          className='mr-4 items-center justify-center'
          style={{
            backgroundColor: settings.crown.bg,
            borderRadius: airy.tileRadius,
            height: airy.tileSize,
            width: airy.tileSize,
          }}
        >
          <Crown color={settings.crown.icon} size={iconSizes.small} />
        </View>
        <View className='flex-1'>
          <View className='flex-row items-center gap-2'>
            <Text
              style={{
                ...typography.body,
                fontWeight: fontWeights.semibold,
                color: themeColors.text.primary,
              }}
            >
              Premium
            </Text>
            <ProfilePremiumBadge label='Active' variant='compact' />
          </View>
          <Text
            className='mt-0.5'
            style={{
              ...typography.caption,
              color: themeColors.text.secondary,
            }}
          >
            All features unlocked
          </Text>
        </View>
      </View>
      <AnnualUpgradeRow onUpgrade={onUpgrade} />
      <SettingsRow
        icon={
          <Settings color={settings.manageSub.icon} size={iconSizes.small} />
        }
        iconBackgroundColor={settings.manageSub.bg}
        label='Manage Subscription'
        type='navigation'
        onPress={handleManageSubscription}
      />
    </SettingsSection>
  );
}
