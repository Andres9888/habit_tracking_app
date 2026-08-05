/**
 * PaywallSheet - In-screen paywall bottom sheet for premium upgrade
 * Uses the shared Modal component with bottomSheet variant for consistent
 * dismiss gestures, backdrop animations, and spring configs.
 */

import { Pressable, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import Modal from '../Modal';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '../../theme/colors';
import { PAYWALL_PERKS } from '../../screens/TemplatesScreen/data/paywallPerks';
import { usePaywallSheet } from './PaywallSheet.hooks';
import type { PaywallSheetProps } from './PaywallSheet.types';
import { paywallSheetStyles as s } from './PaywallSheet.styles';

export function PaywallSheet({
  onClose,
  onPurchaseSuccess,
  visible,
}: PaywallSheetProps) {
  const { handlePurchase, isPurchasing } = usePaywallSheet(
    onClose,
    onPurchaseSuccess
  );

  return (
    <Modal variant='bottomSheet' visible={visible} onClose={onClose}>
      <View testID='templates-paywall' style={s.content}>
        <Pressable
          testID='templates-paywall-close'
          accessibilityLabel='Close'
          accessibilityRole='button'
          hitSlop={8}
          style={s.close}
          onPress={onClose}
        >
          <X color={colors.text.tertiary} size={iconSizes.medium} />
        </Pressable>
        <Text style={s.emoji}>🚀</Text>
        <Text style={s.headline}>Unlock Unlimited Habits</Text>
        <Text style={s.description}>
          Take your habits to the next level with premium features
        </Text>
        <View style={s.perks}>
          {PAYWALL_PERKS.map((perk) => (
            <View key={perk.label} style={s.perkRow}>
              <View style={[s.perkIcon, { backgroundColor: perk.iconBg }]}>
                <Text style={s.perkEmoji}>{perk.emoji}</Text>
              </View>
              <Text style={s.perkLabel}>{perk.label}</Text>
            </View>
          ))}
        </View>
        <Pressable
          testID='templates-paywall-cta'
          style={[s.cta, isPurchasing && s.ctaDisabled]}
          disabled={isPurchasing}
          onPress={handlePurchase}
        >
          <Text style={s.ctaText}>
            {isPurchasing ? 'Processing...' : 'Upgrade to Premium'}
          </Text>
        </Pressable>
        <Text style={s.pricing}>$6.99/month · Cancel anytime</Text>
      </View>
    </Modal>
  );
}
