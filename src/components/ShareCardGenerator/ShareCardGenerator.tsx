import React from 'react';
import { View, ScrollView } from 'react-native';
import { Modal } from '../Modal';
import { Button } from '../Button/Button';
import { useShareCard } from './useShareCard';
import { containerStyles, controlsStyles } from './styles';
import {
  ShareCardPreview,
  ShareCardHeader,
  PlatformSelector,
  GradientSelector,
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
    showUserName,
    setShowUserName,
    selectedPlatform,
    setSelectedPlatform,
    isGenerating,
    milestoneConfig,
    motivationalMessage,
    streakCount,
    format,
    gradient,
    handleShare,
  } = useShareCard(data);

  return (
    <Modal variant='fullScreen' visible={visible} onClose={onClose}>
      <View style={containerStyles.container}>
        <ShareCardHeader onClose={onClose} />

        <View style={containerStyles.previewSection}>
          <ShareCardPreview
            emoji={milestoneConfig.emoji}
            format={format}
            gradient={gradient}
            habitName={data.habitName}
            milestoneLabel={milestoneConfig.label}
            motivationalMessage={motivationalMessage}
            showUserName={showUserName}
            streakCount={streakCount}
            userName={data.userName}
            viewShotRef={viewShotRef as any}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={containerStyles.customizationSection}
        >
          <PlatformSelector
            selectedPlatform={selectedPlatform}
            onSelectPlatform={setSelectedPlatform}
          />

          <GradientSelector
            selectedGradient={selectedGradient}
            onSelectGradient={setSelectedGradient}
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
