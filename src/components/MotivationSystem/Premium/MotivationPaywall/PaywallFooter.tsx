/**
 * PaywallFooter - Restore purchases and fine print
 */

import React from 'react';
import { Pressable, Text } from 'react-native';

interface PaywallFooterProps {
  showRestorePurchases: boolean;
  isProcessing: boolean;
  onRestorePurchases: () => void;
}

export function PaywallFooter({
  showRestorePurchases,
  isProcessing,
  onRestorePurchases,
}: PaywallFooterProps) {
  return (
    <>
      {showRestorePurchases && (
        <Pressable
          className='py-2'
          disabled={isProcessing}
          onPress={onRestorePurchases}
        >
          <Text className='text-center text-sm text-violet-300'>
            Already premium? Restore purchases
          </Text>
        </Pressable>
      )}

      <Text className='mt-4 text-center text-xs text-white/40'>
        By starting your trial, you agree to our Terms of Service and Privacy
        Policy. You won't be charged until your 7-day trial ends.
      </Text>
    </>
  );
}
