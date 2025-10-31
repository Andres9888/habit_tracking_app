import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Palette, X, BookOpen, Microscope, ChevronDown } from 'lucide-react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  ensureNotificationPermissions,
  formatReminderTime,
  getDefaultReminderTime,
  scheduleHabitReminder,
} from '../../utils/notifications';
import { ColorPickerSheet } from './ColorPickerSheet';
import TemplateScienceModal from '../TemplateScienceModal';
import { LinearGradient } from 'expo-linear-gradient';
import { EmojiPicker } from '../EmojiPicker/EmojiPicker';

interface CreateHabitModalProps {
  visible: boolean;
  onClose: () => void;
  habitToEdit?: any; // Accept any Habit-like object with at least _id and name
}

type Category = 'all' | 'morning_routine' | 'health_fitness' | 'productivity' | 'mindfulness';

interface CategoryFilter {
  id: Category;
  label: string;
  icon: string;
}

const COLORS = [
  '#DBEAFE', // blue-100
  '#FFEDD5', // orange-100
  '#DCFCE7', // green-100
  '#F3E8FF', // purple-100
  '#FCE7F3', // pink-100
  '#CCFBF1', // teal-100
];

const CATEGORIES: CategoryFilter[] = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'morning_routine', label: 'Morning', icon: '🌅' },
  { id: 'health_fitness', label: 'Health', icon: '💪' },
  { id: 'productivity', label: 'Productivity', icon: '🎯' },
  { id: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
];

export default function CreateHabitModal({
  visible,
  onClose,
  habitToEdit,
}: CreateHabitModalProps) {
  // Detect edit mode
  const isEditMode = !!habitToEdit;

  // Helper to extract emoji and name from full name (e.g., "💪 Exercise" -> { emoji: "💪", name: "Exercise" })
  const parseHabitName = (fullName: string) => {
    const emojiMatch = fullName.match(/^(\p{Emoji})\s+(.+)$/u);
    if (emojiMatch) {
      return { emoji: emojiMatch[1], name: emojiMatch[2] };
    }
    return { emoji: null, name: fullName };
  };

  const parseReminderTime = (timeString?: string): Date => {
    if (!timeString) return getDefaultReminderTime();
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Initialize form with existing habit data if editing
  const initialParsed = habitToEdit ? parseHabitName(habitToEdit.name) : { emoji: '💪', name: '' };

  const [habitName, setHabitName] = useState(initialParsed.name);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(initialParsed.emoji);
  const [selectedColor, setSelectedColor] = useState('#DBEAFE');
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(habitToEdit?.remindersEnabled ?? false);
  const [reminderTime, setReminderTime] = useState(() =>
    habitToEdit?.reminderTime ? parseReminderTime(habitToEdit.reminderTime) : getDefaultReminderTime()
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderSound, setReminderSound] = useState(habitToEdit?.reminderSound ?? 'Default');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Template browsing state
  const [showTemplateBrowser, setShowTemplateBrowser] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [showTemplateTopShadow, setShowTemplateTopShadow] = useState(false);
  const [showTemplateBottomShadow, setShowTemplateBottomShadow] = useState(false);
  const templateScrollOffset = useRef(0);
  const templateScrollMetrics = useRef({ layoutHeight: 0, contentHeight: 0 });

  // Science modal state
  const [scienceModalVisible, setScienceModalVisible] = useState(false);
  const [selectedTemplateForScience, setSelectedTemplateForScience] = useState<any | null>(null);

  const createHabit = useMutation(api.habits.create);
  const updateHabit = useMutation(api.habits.update);

  // Fetch templates
  const allTemplates = useQuery(api.templates.list, {});
  const isLoadingTemplates = allTemplates === undefined;

  // Filter templates by selected category
  const filteredTemplates = useMemo(() => {
    if (!allTemplates) return [];
    if (selectedCategory === 'all') return allTemplates;
    return allTemplates.filter((t) => t.category === selectedCategory);
  }, [allTemplates, selectedCategory]);

  // Handle category filter tap
  const handleCategoryPress = useCallback((category: Category) => {
    setSelectedCategory(category);
  }, []);

  // Handle template selection - pre-fill form
  const handleTemplateSelect = useCallback((template: any) => {
    // Extract emoji from template icon (first character if it's an emoji)
    const emojiMatch = template.icon?.match(/\p{Emoji}/u);
    const emoji = emojiMatch ? emojiMatch[0] : template.icon;

    // Extract name without emoji
    const nameWithoutEmoji = template.name.replace(/^\p{Emoji}\s*/u, '').trim();

    // Pre-fill form
    setSelectedEmoji(emoji || '💪');
    setHabitName(nameWithoutEmoji);
    if (template.iconColor) {
      setSelectedColor(template.iconColor);
    }

    // Collapse template browser
    setShowTemplateBrowser(false);
  }, []);

  // Handle viewing science modal
  const handleViewScience = useCallback((template: any) => {
    setSelectedTemplateForScience(template);
    setScienceModalVisible(true);
  }, []);

  // Handle using template from science modal
  const handleUseTemplateFromScience = useCallback(() => {
    if (selectedTemplateForScience) {
      handleTemplateSelect(selectedTemplateForScience);
      setScienceModalVisible(false);
    }
  }, [selectedTemplateForScience, handleTemplateSelect]);

  const updateTemplateScrollIndicators = useCallback(() => {
    const { layoutHeight, contentHeight } = templateScrollMetrics.current;
    const offsetY = templateScrollOffset.current;
    const hasScrollableContent = contentHeight > layoutHeight + 1;

    setShowTemplateTopShadow(hasScrollableContent && offsetY > 4);
    setShowTemplateBottomShadow(
      hasScrollableContent && contentHeight - (offsetY + layoutHeight) > 4
    );
  }, []);

  const handleTemplateListScroll = useCallback(
    (event: any) => {
      const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
      templateScrollOffset.current = contentOffset.y;
      templateScrollMetrics.current = {
        layoutHeight: layoutMeasurement.height,
        contentHeight: contentSize.height,
      };
      updateTemplateScrollIndicators();
    },
    [updateTemplateScrollIndicators]
  );

  const handleTemplateListContentSizeChange = useCallback(
    (_width: number, height: number) => {
      templateScrollMetrics.current = {
        ...templateScrollMetrics.current,
        contentHeight: height,
      };
      updateTemplateScrollIndicators();
    },
    [updateTemplateScrollIndicators]
  );

  const handleTemplateListLayout = useCallback(
    (event: any) => {
      templateScrollMetrics.current = {
        ...templateScrollMetrics.current,
        layoutHeight: event.nativeEvent.layout.height,
      };
      updateTemplateScrollIndicators();
    },
    [updateTemplateScrollIndicators]
  );

  useEffect(() => {
    templateScrollOffset.current = 0;
    templateScrollMetrics.current = {
      ...templateScrollMetrics.current,
      contentHeight: 0,
    };
    setShowTemplateTopShadow(false);
    setShowTemplateBottomShadow(false);
  }, [filteredTemplates.length, showTemplateBrowser]);

  const handleCreate = async () => {
    if (!habitName.trim()) return;

    const fullName = selectedEmoji
      ? `${selectedEmoji} ${habitName.trim()}`
      : habitName.trim();
    const reminderTimeString = formatReminderTime(reminderTime);

    let enableReminders = remindersEnabled;
    if (remindersEnabled) {
      const hasPermission = await ensureNotificationPermissions();
      enableReminders = hasPermission;

      if (!hasPermission) {
        Alert.alert(
          'Notifications Disabled',
          'Enable notifications in your device settings to receive habit reminders.'
        );
      }
    }

    if (isEditMode && habitToEdit) {
      // Update existing habit
      await updateHabit({
        habitId: habitToEdit._id,
        name: fullName,
        notes: habitToEdit.notes, // Preserve existing notes
        remindersEnabled: enableReminders,
        reminderTime: enableReminders ? reminderTimeString : undefined,
        reminderSound: enableReminders ? reminderSound : undefined,
      });

      if (enableReminders) {
        await scheduleHabitReminder({
          habitId: habitToEdit._id,
          title: fullName,
          body: 'Time to check in on your habit progress!',
          reminderTime,
          skipPermissionCheck: true,
        });
      }
    } else {
      // Create new habit
      const habitId = await createHabit({
        name: fullName,
        notes: '',
        remindersEnabled: enableReminders,
        reminderTime: enableReminders ? reminderTimeString : undefined,
        reminderSound: enableReminders ? reminderSound : undefined,
      });

      if (enableReminders && habitId) {
        await scheduleHabitReminder({
          habitId,
          title: fullName,
          body: 'Time to check in on your habit progress!',
          reminderTime,
          skipPermissionCheck: true,
        });
      }
    }

    // Reset and close
    setHabitName('');
    setSelectedEmoji('💪');
    setSelectedColor('#DBEAFE');
    setRemindersEnabled(false);
    setReminderTime(getDefaultReminderTime());
    setReminderSound('Default');
    setShowTemplateBrowser(false);
    setSelectedCategory('all');
    onClose();
  };

  return (
    <Modal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 bg-black/50'>
        <View className='mt-12 flex-1 overflow-hidden rounded-t-3xl bg-[#f8f5f1] shadow-2xl'>
          {/* Header */}
          <View className='flex-row items-center justify-between px-4 pb-4 pt-4'>
            <TouchableOpacity
              accessibilityLabel='Close'
              accessibilityRole='button'
              className='h-10 w-10 items-center justify-center rounded-full'
              onPress={onClose}
            >
              <X color='#1a1a1a' size={24} strokeWidth={2} />
            </TouchableOpacity>
            <Text className='text-[20px] font-bold text-[#1a1a1a]'>
              {isEditMode ? 'Edit Habit' : 'Create Habit'}
            </Text>
            <TouchableOpacity
              accessibilityRole='button'
              className={`h-9 items-center justify-center rounded-full px-6 ${
                habitName.trim().length > 0 ? 'bg-[#1a1a1a]' : 'bg-gray-300'
              }`}
              disabled={habitName.trim().length === 0}
              onPress={handleCreate}
            >
              <Text className='text-sm font-semibold text-white'>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className='flex-1 px-4' showsVerticalScrollIndicator={false}>
            {/* Start from Template Button - Only show in create mode (not edit mode) */}
            {!isEditMode && (
              <TouchableOpacity
                accessibilityRole='button'
                accessibilityLabel='Start from template'
                className='mb-4 mt-2 flex-row items-center justify-center gap-2 rounded-xl bg-white py-3'
                onPress={() => setShowTemplateBrowser(!showTemplateBrowser)}
              >
                <BookOpen color='#1a1a1a' size={18} />
                <Text className='text-base font-semibold text-[#1a1a1a]'>
                  {showTemplateBrowser ? 'Hide Templates' : 'Start from Template'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Template Browser - Inline */}
            {showTemplateBrowser && !isEditMode && (
              <View className='mb-6 overflow-hidden rounded-2xl bg-white'>
                {/* Category Filters */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className='border-b border-gray-100'
                  contentContainerClassName='px-3 py-3 gap-2'
                >
                  {CATEGORIES.map((category) => {
                    const isSelected = selectedCategory === category.id;
                    return (
                      <Pressable
                        key={category.id}
                        onPress={() => handleCategoryPress(category.id)}
                        className={`flex-row items-center gap-1 rounded-full px-3 py-2 ${
                          isSelected ? 'bg-[#1a1a1a]' : 'bg-gray-100'
                        }`}
                        accessibilityLabel={`Filter by ${category.label}`}
                        accessibilityRole='button'
                        accessibilityState={{ selected: isSelected }}
                      >
                        <Text className='text-sm'>{category.icon}</Text>
                        <Text
                          className={`text-sm font-medium ${
                            isSelected ? 'text-white' : 'text-[#1a1a1a]'
                          }`}
                        >
                          {category.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                {/* Templates List */}
                <View style={templateScrollStyles.listWrapper}>
                  {isLoadingTemplates ? (
                    <View className='items-center justify-center py-12'>
                      <ActivityIndicator color='#1a1a1a' size='small' />
                      <Text className='mt-2 text-sm text-[#8a8a8a]'>Loading templates...</Text>
                    </View>
                  ) : filteredTemplates.length === 0 ? (
                    <View className='items-center justify-center py-12'>
                      <Text className='text-2xl'>🔍</Text>
                      <Text className='mt-2 text-sm font-medium text-[#1a1a1a]'>
                        No templates in this category
                      </Text>
                      <Text className='mt-1 text-xs text-[#8a8a8a]'>
                        Try selecting a different category
                      </Text>
                    </View>
                  ) : (
                    <FlatList
                      data={filteredTemplates}
                      keyExtractor={(item) => item._id}
                      renderItem={({ item }) => (
                        <View className='flex-row items-center gap-3 border-b border-gray-50 p-3'>
                          <Pressable
                            onPress={() => handleTemplateSelect(item)}
                            className='flex-1 flex-row items-center gap-3'
                            accessibilityRole='button'
                            accessibilityLabel={`Select ${item.name} template`}
                          >
                            {/* Icon */}
                            <View
                              className='h-12 w-12 items-center justify-center rounded-xl'
                              style={{ backgroundColor: item.iconColor + '20' }}
                            >
                              <Text className='text-xl'>{item.icon}</Text>
                            </View>

                            {/* Content */}
                            <View className='flex-1'>
                              <Text className='text-base font-semibold text-[#1a1a1a]' numberOfLines={1}>
                                {item.name}
                              </Text>
                              <Text className='text-xs text-[#8a8a8a]' numberOfLines={2}>
                                {item.description}
                              </Text>
                            </View>
                          </Pressable>

                          {/* Science Button */}
                          <TouchableOpacity
                            onPress={() => handleViewScience(item)}
                            className='h-9 w-9 items-center justify-center rounded-full bg-blue-50'
                            accessibilityRole='button'
                            accessibilityLabel={`View science for ${item.name}`}
                          >
                            <Microscope color='#3B82F6' size={16} strokeWidth={2} />
                          </TouchableOpacity>
                        </View>
                      )}
                      showsVerticalScrollIndicator={true}
                      onScroll={handleTemplateListScroll}
                      scrollEventThrottle={16}
                      onContentSizeChange={handleTemplateListContentSizeChange}
                      onLayout={handleTemplateListLayout}
                    />
                  )}
                  {showTemplateTopShadow && (
                    <LinearGradient
                      pointerEvents='none'
                      colors={['rgba(255,255,255,0.96)', 'rgba(255,255,255,0)']}
                      style={templateScrollStyles.scrollFadeTop}
                    />
                  )}
                  {showTemplateBottomShadow && (
                    <LinearGradient
                      pointerEvents='none'
                      colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.95)']}
                      style={templateScrollStyles.scrollFadeBottom}
                    >
                      <View style={templateScrollStyles.scrollHintChip}>
                        <ChevronDown color='#1a1a1a' size={16} />
                        <Text style={templateScrollStyles.scrollHintText}>
                          Scroll for more templates
                        </Text>
                      </View>
                    </LinearGradient>
                  )}
                </View>
              </View>
            )}

            {/* Preview Card */}
            <View className='mb-6 mt-4 rounded-2xl bg-white p-4'>
              <View className='flex-row items-center gap-4'>
                {selectedEmoji && (
                  <View
                    className='h-16 w-16 items-center justify-center rounded-2xl'
                    style={{ backgroundColor: selectedColor }}
                  >
                    <Text className='text-[30px]'>{selectedEmoji}</Text>
                  </View>
                )}
                <View className='flex-1'>
                  <Text className='text-[20px] font-semibold text-[#1a1a1a]'>
                    {habitName || 'Exercise'}
                  </Text>
                  <Text className='text-sm font-medium text-[#8a8a8a]'>
                    Daily
                  </Text>
                </View>
              </View>
            </View>

            {/* Habit Name Input */}
            <View className='mb-6'>
              <Text className='mb-2 text-base font-semibold text-[#1a1a1a]'>
                Habit Name
              </Text>
              <TextInput
                className='h-14 rounded-xl bg-white px-4 text-base text-[#1a1a1a]'
                placeholder='Exercise'
                placeholderTextColor='#adaebc'
                value={habitName}
                onChangeText={setHabitName}
                autoFocus={visible && !isEditMode}
                returnKeyType='done'
                blurOnSubmit={true}
              />
            </View>

            {/* Icon Picker */}
            <View className='mb-6'>
              <Text className='mb-3 text-base font-semibold text-[#1a1a1a]'>
                Icon
              </Text>
              
              {/* Selected Emoji Preview */}
              {selectedEmoji && (
                <View className='mb-3 items-center'>
                  <View
                    className='h-16 w-16 items-center justify-center rounded-2xl'
                    style={{ backgroundColor: selectedColor }}
                  >
                    <Text className='text-[30px]'>{selectedEmoji}</Text>
                  </View>
                </View>
              )}

              {/* Emoji Picker Button */}
              <TouchableOpacity
                accessibilityLabel='Open emoji picker'
                accessibilityRole='button'
                className='h-14 w-full items-center justify-center rounded-xl bg-blue-500'
                onPress={() => setShowEmojiPicker(true)}
              >
                <Text className='text-base font-semibold text-white'>
                  {selectedEmoji ? 'Change Emoji' : 'Choose Emoji'}
                </Text>
              </TouchableOpacity>

              {/* No Icon Option */}
              {selectedEmoji && (
                <TouchableOpacity
                  accessibilityLabel='Remove icon'
                  accessibilityRole='button'
                  className='mt-3 h-12 w-full items-center justify-center rounded-xl bg-white'
                  style={{
                    borderColor: '#1a1a1a',
                    borderWidth: 1,
                  }}
                  onPress={() => setSelectedEmoji(null)}
                >
                  <Text className='text-sm font-medium text-[#8a8a8a]'>
                    Remove Icon
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Color Picker */}
            <View className='mb-6'>
              <Text className='mb-3 text-base font-semibold text-[#1a1a1a]'>
                Color
              </Text>
              <View className='flex-row flex-wrap gap-3'>
                {COLORS.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    accessibilityLabel={`Select ${color} color`}
                    accessibilityRole='button'
                    className='h-10 w-10 items-center justify-center rounded-full'
                    style={{
                      backgroundColor: color,
                      borderColor: '#1a1a1a',
                      borderWidth: selectedColor === color ? 2 : 0,
                    }}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
              <TouchableOpacity
                accessibilityRole='button'
                className='mt-4 w-full flex-row items-center gap-2 rounded-full bg-white px-3 py-2'
                onPress={() => setIsColorPickerVisible(true)}
              >
                <Palette color='#1a1a1a' size={16} />
                <Text className='flex-1 text-sm font-medium text-[#1a1a1a]'>Custom color</Text>
                <View
                  className='h-4 w-4 rounded-full border border-[#1a1a1a]'
                  style={{ backgroundColor: selectedColor }}
                />
              </TouchableOpacity>
            </View>

            {/* Reminders Section */}
            <View className='mb-6 rounded-2xl bg-white p-4'>
              {/* Reminders Toggle */}
              <View className='mb-4 flex-row items-center justify-between'>
                <Text className='text-base font-semibold text-[#1a1a1a]'>
                  Reminders
                </Text>
                <Switch
                  value={remindersEnabled}
                  onValueChange={setRemindersEnabled}
                  trackColor={{ false: '#E5E5E5', true: '#3B82F6' }}
                  thumbColor='#FFFFFF'
                  ios_backgroundColor='#E5E5E5'
                />
              </View>

              {/* Reminder Settings (shown when enabled) */}
              {remindersEnabled && (
                <>
                  {/* Reminder Time */}
                  <TouchableOpacity
                    className='mb-3 flex-row items-center justify-between rounded-xl bg-[#F5F5F5] px-3 py-3'
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text className='text-base font-medium text-[#1a1a1a]'>
                      Reminder Time
                    </Text>
                    <Text className='text-base font-semibold text-[#3B82F6]'>
                      {formatReminderTime(reminderTime)}
                    </Text>
                  </TouchableOpacity>

                  {/* Sound */}
                  <View className='flex-row items-center justify-between rounded-xl bg-[#F5F5F5] px-3 py-3'>
                    <Text className='text-base font-medium text-[#1a1a1a]'>
                      Sound
                    </Text>
                    <Text className='text-base font-semibold text-[#3B82F6]'>
                      {reminderSound}
                    </Text>
                  </View>
                </>
              )}
            </View>

          </ScrollView>

          {/* Time Picker Modal */}
          {showTimePicker && (
            <DateTimePicker
              value={reminderTime}
              mode='time'
              is24Hour={false}
              display='spinner'
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  setReminderTime(selectedTime);
                }
              }}
            />
          )}
        </View>
      </View>
      <ColorPickerSheet
        presetColors={COLORS}
        value={selectedColor}
        visible={isColorPickerVisible}
        onSelect={setSelectedColor}
        onClose={() => setIsColorPickerVisible(false)}
      />

      <TemplateScienceModal
        visible={scienceModalVisible}
        onClose={() => setScienceModalVisible(false)}
        template={selectedTemplateForScience}
        onUseTemplate={handleUseTemplateFromScience}
      />

      {/* Emoji Picker Modal */}
      <EmojiPicker
        visible={showEmojiPicker}
        selectedEmoji={selectedEmoji}
        onSelect={(emoji) => {
          setSelectedEmoji(emoji);
          setShowEmojiPicker(false);
        }}
        onClose={() => setShowEmojiPicker(false)}
      />
    </Modal>
  );
}

const templateScrollStyles = StyleSheet.create({
  listWrapper: {
    maxHeight: 300,
    position: 'relative',
  },
  scrollFadeTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 32,
  },
  scrollFadeBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 56,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  scrollHintChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(26,26,26,0.08)',
  },
  scrollHintText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
