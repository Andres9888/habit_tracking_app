/** FreePlanCard — neutral subscription status for free users.
 *  Replaces PremiumUpsellCard on the Account page: quiet status, no
 *  conversion treatment. Purchase restoration lives in Account actions. */
import { Star } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

export function FreePlanCard() {
  const { settings } = useThemeColors();

  return (
    <SettingsSection title='Subscription'>
      <SettingsRow
        icon={<Star color={settings.star.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.star.bg}
        label='Free plan'
        subtitle='Core habit tracking is free'
        type='info'
      />
    </SettingsSection>
  );
}
