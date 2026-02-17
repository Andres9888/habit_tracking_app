/* ImportHabitsModal - CSV import for Streaks, Habitica, etc. */
import { useState } from 'react';
import { Modal, View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Upload, X, FileText, CheckCircle2, AlertCircle, Download } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { parseCSV, type ParsedHabit, type CSVFormat } from './csvParser';
import { HabitPreviewList } from './HabitPreviewList';
import { FormatSelector } from './FormatSelector';
import * as DocumentPicker from 'expo-document-picker';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const anim = (delay: number) => FadeInDown.delay(delay).springify().damping(18);

export interface ImportHabitsModalProps {
  visible: boolean;
  onClose: () => void;
  onImportComplete?: (count: number) => void;
}

type Step = 'select-format' | 'preview' | 'importing' | 'complete';

export function ImportHabitsModal({ visible, onClose, onImportComplete }: ImportHabitsModalProps) {
  const { colors, isDark } = useThemeColors();
  const [step, setStep] = useState<Step>('select-format');
  const [selectedFormat, setSelectedFormat] = useState<CSVFormat>('generic');
  const [parsedHabits, setParsedHabits] = useState<ParsedHabit[]>([]);
  const [importedCount, setImportedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const importHabits = useMutation(api.habits.importHabits);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const response = await fetch(file.uri);
      const csvText = await response.text();

      const parsed = parseCSV(csvText, selectedFormat);
      
      if (parsed.length === 0) {
        setError('No habits found in CSV. Check the format and try again.');
        return;
      }

      setParsedHabits(parsed);
      setStep('preview');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read CSV file');
    }
  };

  const handleImport = async () => {
    setStep('importing');
    try {
      await importHabits({ habits: parsedHabits });
      setImportedCount(parsedHabits.length);
      setStep('complete');
      onImportComplete?.(parsedHabits.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
      setStep('preview');
    }
  };

  const handleClose = () => {
    setStep('select-format');
    setParsedHabits([]);
    setImportedCount(0);
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        {/* Header */}
        <View
          className="border-b px-4 py-4"
          style={{
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View
                className="h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
              >
                <Download color={colors.primary[600]} size={20} />
              </View>
              <Text
                className="text-[22px] font-bold"
                style={{ color: colors.text.primary }}
              >
                Import Habits
              </Text>
            </View>
            <Pressable
              onPress={handleClose}
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
            >
              <X color={colors.text.secondary} size={20} />
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-5 py-5">
            {error && (
              <Animated.View entering={anim(0)}>
                <View
                  className="flex-row items-start gap-3 rounded-2xl p-4"
                  style={{ backgroundColor: isDark ? '#7f1d1d' : '#fee2e2' }}
                >
                  <AlertCircle color={isDark ? '#fca5a5' : '#dc2626'} size={20} />
                  <Text
                    className="flex-1 text-[15px]"
                    style={{ color: isDark ? '#fca5a5' : '#dc2626' }}
                  >
                    {error}
                  </Text>
                </View>
              </Animated.View>
            )}

            {step === 'select-format' && (
              <>
                <Animated.View entering={anim(60)}>
                  <Text
                    className="mb-4 text-[17px]"
                    style={{ color: colors.text.secondary }}
                  >
                    Import your habits from other apps like Streaks, Habitica, or any CSV file.
                  </Text>
                  <FormatSelector
                    selected={selectedFormat}
                    onSelect={setSelectedFormat}
                  />
                </Animated.View>

                <Animated.View entering={anim(120)}>
                  <Pressable
                    onPress={handlePickFile}
                    className="items-center justify-center rounded-2xl p-6"
                    style={{
                      backgroundColor: colors.primary[600],
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.08,
                      shadowRadius: 16,
                      elevation: 4,
                    }}
                  >
                    <Upload color="#fff" size={24} />
                    <Text className="mt-2 text-[17px] font-semibold text-white">
                      Choose CSV File
                    </Text>
                  </Pressable>
                </Animated.View>

                <Animated.View entering={anim(180)}>
                  <View
                    className="rounded-2xl p-4"
                    style={{ backgroundColor: colors.card }}
                  >
                    <View className="mb-3 flex-row items-center gap-2">
                      <FileText color={colors.text.secondary} size={16} />
                      <Text
                        className="text-[15px] font-semibold"
                        style={{ color: colors.text.primary }}
                      >
                        CSV Format Examples
                      </Text>
                    </View>
                    <Text
                      className="text-[13px] leading-5"
                      style={{ color: colors.text.secondary }}
                    >
                      <Text className="font-semibold">Generic CSV: </Text>
                      name,frequency,icon{'\n'}
                      <Text className="font-semibold">Streaks: </Text>
                      Task,Frequency,Icon{'\n'}
                      <Text className="font-semibold">Habitica: </Text>
                      habit,type,notes
                    </Text>
                  </View>
                </Animated.View>
              </>
            )}

            {step === 'preview' && (
              <>
                <Animated.View entering={anim(0)}>
                  <Text
                    className="mb-2 text-[17px] font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    Preview ({parsedHabits.length} habits)
                  </Text>
                  <Text
                    className="mb-4 text-[15px]"
                    style={{ color: colors.text.secondary }}
                  >
                    Review the habits before importing. You can edit them after import.
                  </Text>
                </Animated.View>

                <HabitPreviewList habits={parsedHabits} />

                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => setStep('select-format')}
                    className="flex-1 items-center justify-center rounded-xl py-4"
                    style={{ backgroundColor: colors.card }}
                  >
                    <Text
                      className="text-[17px] font-semibold"
                      style={{ color: colors.text.secondary }}
                    >
                      Back
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleImport}
                    className="flex-1 items-center justify-center rounded-xl py-4"
                    style={{ backgroundColor: colors.primary[600] }}
                  >
                    <Text className="text-[17px] font-semibold text-white">
                      Import {parsedHabits.length} Habits
                    </Text>
                  </Pressable>
                </View>
              </>
            )}

            {step === 'importing' && (
              <Animated.View entering={anim(0)}>
                <View className="items-center py-12">
                  <ActivityIndicator size="large" color={colors.primary[600]} />
                  <Text
                    className="mt-4 text-[17px]"
                    style={{ color: colors.text.secondary }}
                  >
                    Importing habits...
                  </Text>
                </View>
              </Animated.View>
            )}

            {step === 'complete' && (
              <Animated.View entering={anim(0)}>
                <View className="items-center py-12">
                  <View
                    className="h-20 w-20 items-center justify-center rounded-full"
                    style={{ backgroundColor: isDark ? '#065f46' : '#d1fae5' }}
                  >
                    <CheckCircle2
                      color={isDark ? '#34d399' : '#059669'}
                      size={40}
                    />
                  </View>
                  <Text
                    className="mt-4 text-[22px] font-bold"
                    style={{ color: colors.text.primary }}
                  >
                    Import Complete!
                  </Text>
                  <Text
                    className="mt-2 text-[17px]"
                    style={{ color: colors.text.secondary }}
                  >
                    {importedCount} habits imported successfully
                  </Text>
                  <Pressable
                    onPress={handleClose}
                    className="mt-6 items-center justify-center rounded-xl px-8 py-4"
                    style={{ backgroundColor: colors.primary[600] }}
                  >
                    <Text className="text-[17px] font-semibold text-white">
                      Done
                    </Text>
                  </Pressable>
                </View>
              </Animated.View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
