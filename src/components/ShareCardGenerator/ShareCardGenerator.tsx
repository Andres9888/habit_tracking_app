/**
 * ShareCardGenerator Component
 * Based on UX Specification Flow 5 (lines 560-661)
 *
 * Features:
 * - Gradient backgrounds using brand colors
 * - Platform-specific formats (Instagram Story/Feed, Twitter, Facebook)
 * - Customization options (background color, personal message, user name toggle)
 * - Native share sheet integration
 *
 * Usage: Triggered from Milestone Celebration modal
 */

import React from 'react';
import { View, ScrollView, Keyboard } from 'react-native';
import type ViewShot from 'react-native-view-shot';
import { Modal } from '../Modal';
import { Button } from '../Button/Button';
import { useShareCard } from './useShareCard';
import { containerStyles, controlsStyles } from './styles';
import {
  ShareCardPreview,
  ShareCardHeader,
  PlatformSelector,
  GradientSelector,
  PersonalMessageInput,
  UserNameToggle,
} from './components';
import type { ShareCardGeneratorProps } from './ShareCardGenerator.types';

export function ShareCardGenerator({
  visible,
  onClose,
  data,
}: ShareCardGeneratorProps) {
  const {
    viewShotRef,
    selectedGradient,
    setSelectedGradient,
    personalMessage,
    setPersonalMessage,
    showUserName,
    setShowUserName,
    selectedPlatform,
    setSelectedPlatform,
    isGenerating,
    milestoneConfig,
    format,
    gradient,
    handleShare,
  } = useShareCard(data);

  return (
    <Modal variant='fullScreen' visible={visible} onClose={onClose}>
      accessibilityViewIsModal
      <View style={containerStyles.container}>
        <ShareCardHeader onClose={onClose} />

        <View style={containerStyles.previewSection}>
          <ShareCardPreview
            emoji={milestoneConfig.emoji}
            format={format}
            gradient={gradient}
            habitName={data.habitName}
            milestoneLabel={milestoneConfig.label}
            personalMessage={personalMessage}
            showUserName={showUserName}
            strengthPercentage={data.strengthPercentage}
            userName={data.userName}
            viewShotRef={viewShotRef as React.RefObject<ViewShot>}
          />
        </View>

        <ScrollView
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          style={containerStyles.customizationSection}
          onScrollBeginDrag={Keyboard.dismiss}
        >
          <PlatformSelector
            selectedPlatform={selectedPlatform}
            onSelectPlatform={setSelectedPlatform}
          />

          <GradientSelector
            selectedGradient={selectedGradient}
            onSelectGradient={setSelectedGradient}
          />

          <PersonalMessageInput
            value={personalMessage}
            onChangeText={setPersonalMessage}
          />

          <UserNameToggle
            showUserName={showUserName}
            userName={data.userName}
            onToggle={setShowUserName}
          />

          <Button
            fullWidth
            loading={isGenerating}
            style={controlsStyles.shareButton}
            onPress={handleShare}
          >
            Share to {selectedPlatform.replace('-', ' ')}
          </Button>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default ShareCardGenerator;
