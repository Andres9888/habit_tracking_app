/**
 * WhyBenefitsEditModal — Bottom-sheet editor for habit.why, identity,
 * benefits[], scienceNote. Triggered from HabitWhyBenefitsCard.
 */
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../../theme/typography';
import { Field } from './Field';
import { useWhyBenefitsEdit } from './WhyBenefitsEditModal.hooks';
import type { WhyBenefitsEditModalProps } from './WhyBenefitsEditModal.types';

export function WhyBenefitsEditModal({ habit, visible, onClose }: WhyBenefitsEditModalProps) {
  const { colors } = useThemeColors();
  const { form, setField, saving, handleSave } = useWhyBenefitsEdit({ habit, visible, onClose });

  return (
    <Modal animationType='slide' transparent visible={visible} onRequestClose={onClose}>
      <Pressable className='flex-1 justify-end bg-black/40' onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable
            className='rounded-t-3xl px-5 pb-10 pt-3'
            style={{ backgroundColor: colors.card, maxHeight: '90%' }}
            onPress={(event) => event.stopPropagation()}
          >
            <View
              className='mx-auto mb-3 h-1 w-10 rounded-full'
              style={{ backgroundColor: colors.border }}
            />
            <View className='mb-4 flex-row items-center justify-between'>
              <Pressable accessibilityRole='button' onPress={onClose}>
                <Text style={{ ...typography.bodySmall, color: colors.text.secondary }}>
                  Cancel
                </Text>
              </Pressable>
              <Text
                style={{ ...typography.heading3, color: colors.text.primary, fontFamily: 'Literata' }}
              >
                Why &amp; Benefits
              </Text>
              <Pressable
                accessibilityRole='button'
                disabled={saving}
                onPress={() => void handleSave()}
              >
                <Text
                  style={{
                    ...typography.bodySmall,
                    color: colors.primary[600],
                    fontWeight: fontWeights.semibold,
                    opacity: saving ? 0.5 : 1,
                  }}
                >
                  {saving ? 'Saving…' : 'Save'}
                </Text>
              </Pressable>
            </View>
            <ScrollView
              keyboardDismissMode='on-drag'
              keyboardShouldPersistTaps='handled'
              showsVerticalScrollIndicator={false}
            >
              <Field
                label='Your why'
                placeholder="What do you want from this habit?"
                value={form.why}
                onChangeText={(v) => setField('why', v)}
              />
              <Field
                label="Who you're becoming"
                placeholder='I am someone who…'
                value={form.identity}
                onChangeText={(v) => setField('identity', v)}
              />
              <Field
                hint='One per line. Up to 10.'
                label='Benefits'
                minHeight={88}
                placeholder={'Boosts mood\nImproves sleep'}
                value={form.benefitsRaw}
                onChangeText={(v) => setField('benefitsRaw', v)}
              />
              <Field
                label='Science note'
                minHeight={88}
                placeholder='What the research says, in 1–2 sentences.'
                value={form.scienceNote}
                onChangeText={(v) => setField('scienceNote', v)}
              />
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
