/** AnnualUpgradeRow — monthly -> annual nudge inside PremiumActiveCard.
 *
 *  Only renders for monthly subscribers when the offering actually carries a
 *  cheaper annual package, so it never advertises a saving we can't honour. */
import { TrendingUp } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { usePremium } from '@/hooks/usePremium';
import { useThemeColors } from '../../../theme/ThemeContext';
import { SettingsRow } from '../SettingsRow';

interface Props {
  onUpgrade?: () => void;
}

export function AnnualUpgradeRow({ onUpgrade }: Props) {
  const { settings } = useThemeColors();
  const { annualPackage, annualPriceString, annualSavingsPercent, isAnnualPlan } =
    usePremium();

  if (isAnnualPlan) return null;
  if (!annualPackage || !annualPriceString) return null;

  const subtitle =
    annualSavingsPercent !== null
      ? `${annualPriceString}/yr — save ${annualSavingsPercent}%`
      : `${annualPriceString}/yr`;

  return (
    <SettingsRow
      icon={<TrendingUp color={settings.user.icon} size={iconSizes.small} />}
      iconBackgroundColor={settings.user.bg}
      label='Switch to annual'
      subtitle={subtitle}
      type='navigation'
      onPress={onUpgrade}
    />
  );
}
