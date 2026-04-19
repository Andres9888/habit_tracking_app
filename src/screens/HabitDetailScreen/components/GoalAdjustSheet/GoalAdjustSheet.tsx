/**
 * GoalAdjustSheet — Bottom-sheet for changing or removing the streak goal.
 * Reuses GoalPresetChip. Remove uses tap-again-to-confirm.
 */
import { Modal, Pressable, Text, View } from 'react-native';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { typography } from '../../../../theme/typography';
import { GoalPresetChip } from '../GoalPresetChip';
import { useGoalAdjust } from './GoalAdjustSheet.hooks';

const PRESETS = [7, 21, 30, 66, 100, 365];
const RECOMMENDED = 66;
const labelFor = (d: number) => (d === 365 ? '1-year' : `${d}-day`);

interface GoalAdjustSheetProps {
  habitId: Id<'habits'>;
  currentGoal: number;
  visible: boolean;
  onClose: () => void;
}

export function GoalAdjustSheet(props: GoalAdjustSheetProps) {
  const { currentGoal, visible, onClose } = props;
  const { colors } = useThemeColors();
  const { confirmRemove, handleRemove, handleSelect, handleUpdate, saving, selected } =
    useGoalAdjust(props);

  return (
    <Modal animationType='slide' transparent visible={visible} onRequestClose={onClose}>
      <Pressable className='flex-1 justify-end bg-black/40' onPress={onClose}>
        <Pressable
          className='rounded-t-3xl px-5 pb-10 pt-3'
          style={{ backgroundColor: colors.card }}
          onPress={(event) => event.stopPropagation()}
        >
          <View
            className='mx-auto mb-4 h-1 w-10 rounded-full'
            style={{ backgroundColor: colors.border }}
          />
          <Text
            className='text-center'
            style={{ ...typography.heading3, color: colors.text.primary, fontFamily: 'Literata' }}
          >
            Adjust your goal
          </Text>
          <Text
            className='mb-4 mt-1 text-center'
            style={{ ...typography.caption, color: colors.text.secondary }}
          >
            Currently: {currentGoal > 0 ? `${labelFor(currentGoal)} streak` : 'none'}
          </Text>
          <View className='mb-5 flex-row flex-wrap justify-center gap-2'>
            {PRESETS.map((days) => (
              <GoalPresetChip
                key={days}
                days={days}
                recommended={days === RECOMMENDED}
                selected={days === selected}
                onPress={() => handleSelect(days)}
              />
            ))}
          </View>
          <Pressable
            accessibilityRole='button'
            className='mb-2 items-center rounded-xl px-6 py-3.5'
            disabled={saving}
            style={{ backgroundColor: colors.primary[600], opacity: saving ? 0.6 : 1 }}
            onPress={() => void handleUpdate()}
          >
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
              {saving ? 'Saving…' : `Set ${labelFor(selected)} goal`}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole='button'
            className='items-center rounded-xl px-6 py-3'
            disabled={saving}
            onPress={() => void handleRemove()}
          >
            <Text
              style={{ ...typography.bodySmall, color: colors.status.error, fontWeight: '600' }}
            >
              {confirmRemove ? 'Tap again to confirm' : 'Remove goal'}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
