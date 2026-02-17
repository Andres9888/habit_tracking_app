/**
 * StatCardPreview — scaled-down preview of the stat card
 *
 * Mirrors the pattern used in ShareCardGenerator/ShareCardPreview.
 * The real card (CARD_WIDTH × CARD_HEIGHT) is rendered off-screen at
 * full resolution so ViewShot captures a crisp image, while this wrapper
 * applies a CSS-like `scale` transform to fit the device screen.
 */

import React, { RefObject } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { StreakCard } from './StreakCard';
import { MonthlyRecapCard } from './MonthlyRecapCard';
import { YearInReviewCard } from './YearInReviewCard';
import { CARD_WIDTH, CARD_ASPECT_RATIO } from '../StatCardGenerator.constants';
import type {
  StatCardType,
  StatCardVariant,
  StreakCardData,
  MonthlyRecapCardData,
  YearInReviewCardData,
} from '../StatCardGenerator.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface StatCardPreviewProps {
  viewShotRef: RefObject<ViewShot>;
  selectedType: StatCardType;
  selectedVariant: StatCardVariant;
  streakData: StreakCardData;
  monthlyData: MonthlyRecapCardData;
  yearData: YearInReviewCardData;
  userName?: string;
}

export function StatCardPreview({
  viewShotRef,
  selectedType,
  selectedVariant,
  streakData,
  monthlyData,
  yearData,
  userName,
}: StatCardPreviewProps) {
  const previewWidth = SCREEN_WIDTH - 48;
  const previewHeight = previewWidth / CARD_ASPECT_RATIO;
  const scale = previewWidth / CARD_WIDTH;

  return (
    <View style={[styles.container, { height: previewHeight, width: previewWidth }]}>
      <View style={{ transform: [{ scale }], transformOrigin: 'top left' }}>
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'png', height: CARD_WIDTH, quality: 1, width: CARD_WIDTH }}
        >
          {selectedType === 'streak-30day' && (
            <StreakCard
              data={streakData}
              userName={userName}
              variant={selectedVariant}
            />
          )}
          {selectedType === 'monthly-recap' && (
            <MonthlyRecapCard
              data={monthlyData}
              userName={userName}
              variant={selectedVariant}
            />
          )}
          {selectedType === 'year-in-review' && (
            <YearInReviewCard
              data={yearData}
              userName={userName}
              variant={selectedVariant}
            />
          )}
        </ViewShot>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
});
