/** PremiumActiveCard — quiet status card for active subscribers */
import { Text, View } from 'react-native';
import { Crown, Settings } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';
import { AnnualUpgradeRow } from './AnnualUpgradeRow';
import { handleManageSubscription } from './PremiumStatus.helpers';

interface PremiumActiveCardProps {
  onUpgrade?: () => void;
}

export function PremiumActiveCard({ onUpgrade }: PremiumActiveCardProps) {
  const { colors: themeColors, settings } = useThemeColors();

  return (
    <SettingsSection title='Premium'>
      <View className='flex-row items-center px-4 py-4'>
        <View
          className='mr-4 h-10 w-10 items-center justify-center rounded-xl'
          style={{ backgroundColor: settings.crown.bg }}
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
            <View
              className='rounded-full px-2 py-0.5'
              style={{ backgroundColor: themeColors.status.streakLight }}
            >
              <Text
                style={{
                  ...typography.tabBar,
                  fontWeight: fontWeights.bold,
                  textTransform: 'uppercase',
                  color: settings.crown.icon,
                }}
              >
                Active
              </Text>
            </View>
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
