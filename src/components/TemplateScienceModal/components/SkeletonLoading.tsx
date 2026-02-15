/**
 * SkeletonLoading - Loading state for TemplateScienceModal
 */

import React from 'react';
import { View } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';

import Modal from '../../Modal';
import { SkeletonBox } from './SkeletonBox';
import { useThemeColors } from '../../../theme/ThemeContext';
import { layoutStyles, themedLayoutStyles, headerStyles, themedHeaderStyles, skeletonStyles } from '../styles';

interface SkeletonLoadingProps {
  visible: boolean;
  onClose: () => void;
}

export const SkeletonLoading = ({ visible, onClose }: SkeletonLoadingProps) => {
  const { colors } = useThemeColors();
  const themedLayout = themedLayoutStyles(colors);
  const themedHeader = themedHeaderStyles(colors);

  return (
    <Modal
      accessibilityViewIsModal
      disableBackdropClose={false}
      variant='fullScreen'
      visible={visible}
      onClose={onClose}
    >
      <View style={[layoutStyles.container, themedLayout.container]}>
        <View style={themedHeader.header}>
          <SkeletonBox borderRadius={20} height={40} width={40} />
          <SkeletonBox borderRadius={8} height={20} width={120} />
          <View style={headerStyles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={layoutStyles.contentContainer}
          showsVerticalScrollIndicator={false}
          style={layoutStyles.content}
        >
          <View style={skeletonStyles.skeletonHero}>
            <SkeletonBox borderRadius={28} height={96} width={96} />
            <SkeletonBox
              borderRadius={8}
              height={32}
              style={{ marginTop: 20 }}
              width={200}
            />
            <View style={skeletonStyles.skeletonPillRow}>
              <SkeletonBox borderRadius={20} height={32} width={100} />
              <SkeletonBox borderRadius={20} height={32} width={80} />
            </View>
          </View>

          <View style={skeletonStyles.skeletonCard}>
            <View style={skeletonStyles.skeletonCardHeader}>
              <SkeletonBox borderRadius={12} height={36} width={36} />
              <SkeletonBox borderRadius={8} height={20} width={150} />
            </View>
            <SkeletonBox borderRadius={8} height={16} width='100%' />
            <SkeletonBox
              borderRadius={8}
              height={16}
              style={{ marginTop: 8 }}
              width='90%'
            />
            <SkeletonBox
              borderRadius={8}
              height={16}
              style={{ marginTop: 8 }}
              width='70%'
            />
          </View>

          <View style={skeletonStyles.skeletonCard}>
            <View style={skeletonStyles.skeletonCardHeader}>
              <SkeletonBox borderRadius={12} height={36} width={36} />
              <SkeletonBox borderRadius={8} height={20} width={150} />
            </View>
            <SkeletonBox borderRadius={16} height={120} width='100%' />
            <SkeletonBox
              borderRadius={16}
              height={100}
              style={{ marginTop: 16 }}
              width='100%'
            />
          </View>
        </ScrollView>

        <View style={skeletonStyles.skeletonFooter}>
          <SkeletonBox borderRadius={12} height={52} width='100%' />
          <SkeletonBox
            borderRadius={8}
            height={40}
            style={{ marginTop: 8 }}
            width='100%'
          />
        </View>
      </View>
    </Modal>
  );
};
