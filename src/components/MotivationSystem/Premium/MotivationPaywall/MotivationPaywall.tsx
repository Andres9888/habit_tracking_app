/**
 * MotivationPaywall - Human-optimized paywall
 * @see paywall-redesign-spec.md
 */

import React from 'react';
import { ScrollView, Modal, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { PaywallHeader } from './PaywallHeader';
import { PaywallHeadline } from './PaywallHeadline';
import { PaywallFeatures } from './PaywallFeatures';
import { PricingCards } from './PricingCards';
import { PaywallCTA } from './PaywallCTA';
import { PaywallFooterRedesign } from './PaywallFooterRedesign';
import { useBackgroundAnimation } from './usePaywallEntryAnimations';
import { usePaywallHandlers } from './usePaywallHandlers';
import { PAYWALL_COLORS } from './paywall.constants';
import type { MotivationPaywallProps } from './types';

export function MotivationPaywall({
  visible,
  onClose,
  onStartTrial,
  onRestorePurchases,
  reduceMotion = false,
  testID,
}: MotivationPaywallProps) {
  const insets = useSafeAreaInsets();
  const { animatedStyle: bgAnim } = useBackgroundAnimation(
    visible,
    reduceMotion
  );
  const {
    isProcessing,
    selectedPlan,
    handleClose,
    handleSelectPlan,
    handleStartTrial,
    handleRestorePurchases,
  } = usePaywallHandlers({ onClose, onRestorePurchases, onStartTrial });

  return (
    <Modal
      transparent
      animationType={reduceMotion ? 'fade' : 'slide'}
      testID={testID}
      visible={visible}
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[
          styles.container,
          { paddingTop: insets.top },
          reduceMotion ? undefined : bgAnim,
        ]}
      >
        <PaywallHeader onClose={handleClose} />
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 32 },
          ]}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          <PaywallHeadline reduceMotion={reduceMotion} visible={visible} />
          <PaywallFeatures reduceMotion={reduceMotion} visible={visible} />
          <PricingCards
            reduceMotion={reduceMotion}
            selectedPlan={selectedPlan}
            visible={visible}
            onSelectPlan={handleSelectPlan}
          />
          <PaywallCTA
            isProcessing={isProcessing}
            reduceMotion={reduceMotion}
            selectedPlan={selectedPlan}
            visible={visible}
            onPress={handleStartTrial}
          />
          <PaywallFooterRedesign
            isProcessing={isProcessing}
            showRestorePurchases={!!onRestorePurchases}
            onRestorePurchases={handleRestorePurchases}
          />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

export default MotivationPaywall;

const styles = StyleSheet.create({
  container: { backgroundColor: PAYWALL_COLORS.background, flex: 1 },
  scrollContent: { flexGrow: 1 },
  scrollView: { flex: 1 },
});
