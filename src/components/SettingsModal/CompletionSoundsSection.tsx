/**
 * Completion Sounds Section
 *
 * Settings section for completion sounds premium feature.
 * Allows users to enable/disable and select sound options.
 *
 * Created by Opus.
 */

import { Volume2, VolumeX } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { SettingsRow } from '../SettingsRow';
import { SettingsSection } from '../SettingsSection';
import { COMPLETION_SOUNDS, type CompletionSoundName } from '../../utils/sounds';
import type { SettingsContentProps } from './types';

interface CompletionSoundsSectionProps {
  completionSoundEnabled: boolean;
  completionSoundSelected: CompletionSoundName;
  isPremium: boolean;
  highContrastMode: boolean;
  onToggle: (value: boolean) => void | Promise<void>;
  onChangeSound: (value: CompletionSoundName) => void | Promise<void>;
  onPremiumUpsell?: () => void;
}

export function CompletionSoundsSection({
  completionSoundEnabled,
  completionSoundSelected,
  isPremium,
  highContrastMode,
  onToggle,
  onChangeSound,
  onPremiumUpsell,
}: CompletionSoundsSectionProps) {
  // If not premium, show upgrade prompt
  if (!isPremium) {
    return (
      <SettingsSection highContrastMode={highContrastMode} title='Completion Sounds'>
        <SettingsRow
          highContrastMode={highContrastMode}
          icon={<Volume2 color='#8b5cf6' size={16} />}
          iconBackgroundColor='#ddd6fe'
          label='Completion Sounds'
          showBorder={false}
          type='premium'
          onPress={onPremiumUpsell}
        />
      </SettingsSection>
    );
  }

  return (
    <SettingsSection highContrastMode={highContrastMode} title='Completion Sounds'>
      <SettingsRow
        highContrastMode={highContrastMode}
        icon={
          completionSoundEnabled ? (
            <Volume2 color='#8b5cf6' size={16} />
          ) : (
            <VolumeX color='#6b7280' size={16} />
          )
        }
        iconBackgroundColor='#ddd6fe'
        label='Play sound on habit completion'
        type='toggle'
        value={completionSoundEnabled}
        onToggle={onToggle}
      />

      {completionSoundEnabled && (
        <View className='px-4 pb-4'>
          <Text className='mb-3 text-[13px] font-semibold text-gray-600'>
            Sound Style
          </Text>
          <View className='flex-row gap-2'>
            {COMPLETION_SOUNDS.map((sound) => {
              const isSelected = completionSoundSelected === sound.name;
              return (
                <Pressable
                  key={sound.name}
                  className={`flex-1 rounded-lg px-3 py-3 ${
                    isSelected ? 'bg-emerald-100' : 'bg-gray-100'
                  }`}
                  onPress={() => onChangeSound(sound.name)}
                >
                  <Text
                    className={`text-center text-[13px] font-semibold ${
                      isSelected ? 'text-emerald-700' : 'text-gray-600'
                    }`}
                  >
                    {sound.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </SettingsSection>
  );
}
