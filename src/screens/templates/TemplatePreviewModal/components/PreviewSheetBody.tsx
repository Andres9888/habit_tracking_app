/**
 * Scrollable body of the TemplatePreviewModal sheet
 */

import React from 'react';
import { Keyboard, Pressable, ScrollView } from 'react-native';
import { PreviewNameSection } from './PreviewNameSection';
import { CustomizationSections } from './CustomizationSections';
import type { PreviewSheetBodyProps } from '../types';

// eslint-disable-next-line max-lines-per-function
export function PreviewSheetBody({
  template,
  isImporting,
  paddingBottom,
  scrollViewRef,
  preview,
}: PreviewSheetBodyProps) {
  return (
    <ScrollView
      ref={scrollViewRef}
      className='flex-1'
      contentContainerStyle={{ paddingBottom }}
      keyboardDismissMode='on-drag'
      keyboardShouldPersistTaps='handled'
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={Keyboard.dismiss}>
        <PreviewNameSection
          customColor={preview.customColor}
          customIcon={preview.customIcon}
          customName={preview.customName}
          isImporting={isImporting}
          template={template}
          onChangeName={preview.setCustomName}
        />
        <CustomizationSections
          customColor={preview.customColor}
          customIcon={preview.customIcon}
          customName={preview.customName}
          progressEmojis={preview.progressEmojis}
          reminderTime={preview.reminderTime}
          scrollToEnd={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
          showTimePicker={preview.showTimePicker}
          streakGoal={preview.streakGoal}
          strengthAlgorithm={preview.strengthAlgorithm}
          template={template}
          onColorSelect={preview.handleColorSelect}
          onIconSelect={preview.handleIconSelect}
          onProgressEmojisChange={preview.handleProgressEmojisChange}
          onStreakGoalChange={preview.handleStreakGoalChange}
          onStrengthAlgorithmChange={preview.handleStrengthAlgorithmChange}
          onTimeChange={preview.handleTimeChange}
          onToggleTimePicker={preview.setShowTimePicker}
        />
      </Pressable>
    </ScrollView>
  );
}
