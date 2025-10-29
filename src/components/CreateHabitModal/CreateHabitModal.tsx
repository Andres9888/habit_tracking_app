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
  Keyboard,
  Animated,
  Easing,
} from 'react-native';
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  KeyboardEvent,
} from 'react-native';
import {
  Palette,
  X,
  BookOpen,
  Microscope,
  ChevronDown,
  ChevronRight,
} from 'lucide-react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Doc } from '../../../convex/_generated/dataModel';
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

interface CreateHabitModalProps {
  visible: boolean;
  onClose: () => void;
  habitToEdit?: any; // Accept any Habit-like object with at least _id and name
}

type Category =
  | 'all'
  | 'morning_routine'
  | 'health_fitness'
  | 'productivity'
  | 'mindfulness';

interface CategoryFilter {
  id: Category;
  label: string;
  icon: string;
}

const EMOJIS = [
  '💪',
  '🧘',
  '📖',
  '💧',
  '🎨',
  '🏃',
  '🍎',
  '🥗',
  '☕',
  '💤',
  '🎯',
  '✍️',
  '🚴',
  '🧠',
  '🎵',
  '🌞',
  '🌙',
  '⚡',
  '🔥',
  '🌱',
  '🏋️',
  '🚶',
  '🧘‍♀️',
  '🎨',
  '📝',
  '💼',
  '📚',
  '🎓',
  '💡',
  '🏆',
];

const COLORS = [
  '#DBEAFE', // blue-100
  '#FFEDD5', // orange-100
  '#DCFCE7', // green-100
  '#F3E8FF', // purple-100
  '#FCE7F3', // pink-100
  '#CCFBF1', // teal-100
];

const CATEGORIES: CategoryFilter[] = [
  { icon: '✨', id: 'all', label: 'All' },
  { icon: '🌅', id: 'morning_routine', label: 'Morning' },
  { icon: '💪', id: 'health_fitness', label: 'Health' },
  { icon: '🎯', id: 'productivity', label: 'Productivity' },
  { icon: '🧘', id: 'mindfulness', label: 'Mindfulness' },
];

const HABIT_NAME_REGEX = /^(\p{Emoji})\s+(.+)$/u;

const parseHabitName = (fullName: string) => {
  const emojiMatch = fullName.match(HABIT_NAME_REGEX);
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

export default function CreateHabitModal({
  visible,
  onClose,
  habitToEdit,
}: CreateHabitModalProps) {
  // Detect edit mode
  const isEditMode = !!habitToEdit;

  // Initialize form with existing habit data if editing
  const initialParsed = habitToEdit
    ? parseHabitName(habitToEdit.name)
    : { emoji: '💪', name: '' };

  const [habitName, setHabitName] = useState(initialParsed.name);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(
    initialParsed.emoji
  );
  const [selectedColor, setSelectedColor] = useState('#DBEAFE');
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(
    habitToEdit?.remindersEnabled ?? false
  );
  const [reminderTime, setReminderTime] = useState(() =>
    habitToEdit?.reminderTime
      ? parseReminderTime(habitToEdit.reminderTime)
      : getDefaultReminderTime()
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderSound, setReminderSound] = useState(
    habitToEdit?.reminderSound ?? 'Default'
  );

  // Template browsing state
  const [isTemplateBrowserOpen, setIsTemplateBrowserOpen] = useState(false);
  const [isTemplateBrowserVisible, setIsTemplateBrowserVisible] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [showTemplateTopShadow, setShowTemplateTopShadow] = useState(false);
  const [showTemplateBottomShadow, setShowTemplateBottomShadow] =
    useState(false);
  const templateScrollOffset = useRef(0);
  const templateScrollMetrics = useRef({ contentHeight: 0, layoutHeight: 0 });
  const scrollViewRef = useRef<import('react-native').ScrollView | null>(null);
  const templateBrowserAnim = useRef(new Animated.Value(0)).current;
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const chevronRotation = useMemo(
    () =>
      templateBrowserAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'] as const,
      }),
    [templateBrowserAnim]
  );
  const templateBrowserTranslate = useMemo(
    () =>
      templateBrowserAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-12, 0],
      }),
    [templateBrowserAnim]
  );

  useEffect(() => {
    const handleKeyboardShow = (event: KeyboardEvent) => {
      setIsKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates?.height ?? 0);
    };

    const handleKeyboardHide = () => {
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const hideSub = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Science modal state
  const [scienceModalVisible, setScienceModalVisible] = useState(false);
  const [selectedTemplateForScience, setSelectedTemplateForScience] =
    useState<Doc<'templates'> | null>(null);

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

  const openTemplateBrowser = useCallback(() => {
    setIsTemplateBrowserOpen(true);
    setIsTemplateBrowserVisible(true);
    setHasScrolledPastHero(false);
    templateBrowserAnim.stopAnimation();
    Animated.timing(templateBrowserAnim, {
      duration: 220,
      easing: Easing.out(Easing.ease),
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [templateBrowserAnim]);

  const closeTemplateBrowser = useCallback(() => {
    setIsTemplateBrowserOpen(false);
    templateBrowserAnim.stopAnimation();
    Animated.timing(templateBrowserAnim, {
      duration: 180,
      easing: Easing.out(Easing.ease),
      toValue: 0,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsTemplateBrowserVisible(false);
      }
    });
  }, [templateBrowserAnim]);

  const handleHeroPress = useCallback(() => {
    if (isTemplateBrowserOpen) {
      closeTemplateBrowser();
      return;
    }
    openTemplateBrowser();
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({ animated: true, y: 0 });
    });
  }, [closeTemplateBrowser, isTemplateBrowserOpen, openTemplateBrowser]);

  const handleMainScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isEditMode || isTemplateBrowserOpen) return;
      const offsetY = event.nativeEvent.contentOffset.y;
      setHasScrolledPastHero((prev) => {
        const next = offsetY > 120;
        return prev === next ? prev : next;
      });
    },
    [isEditMode, isTemplateBrowserOpen]
  );

  const handleReminderPress = useCallback(() => {
    if (isTemplateBrowserOpen) return;
    scrollViewRef.current?.scrollTo({ animated: true, y: 0 });
    setTimeout(() => {
      openTemplateBrowser();
    }, 160);
  }, [isTemplateBrowserOpen, openTemplateBrowser]);

  useEffect(() => {
    if (!visible) {
      setIsTemplateBrowserOpen(false);
      setIsTemplateBrowserVisible(false);
      templateBrowserAnim.stopAnimation();
      templateBrowserAnim.setValue(0);
      setHasScrolledPastHero(false);
      setSelectedCategory('all');
    }
  }, [templateBrowserAnim, visible]);

  const shouldShowTemplateReminder =
    !isEditMode && hasScrolledPastHero && !isTemplateBrowserVisible;
  const reminderBottomOffset = isKeyboardVisible ? keyboardHeight + 24 : 24;

  // Handle template selection - pre-fill form
  const handleTemplateSelect = useCallback(
    (template: any) => {
      // Extract emoji from template icon (first character if it's an emoji)
      const emojiMatch = template.icon?.match(/\p{Emoji}/u);
      const emoji = emojiMatch ? emojiMatch[0] : template.icon;

      // Extract name without emoji
      const nameWithoutEmoji = template.name
        .replace(/^\p{Emoji}\s*/u, '')
        .trim();

      // Pre-fill form
      setSelectedEmoji(emoji || '💪');
      setHabitName(nameWithoutEmoji);
      if (template.iconColor) {
        setSelectedColor(template.iconColor);
      }

      // Collapse template browser
      closeTemplateBrowser();
    },
    [closeTemplateBrowser]
  );

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
      const { contentOffset, layoutMeasurement, contentSize } =
        event.nativeEvent;
      templateScrollOffset.current = contentOffset.y;
      templateScrollMetrics.current = {
        contentHeight: contentSize.height,
        layoutHeight: layoutMeasurement.height,
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
  }, [filteredTemplates.length, isTemplateBrowserOpen]);

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
        reminderSound: enableReminders ? reminderSound : undefined,
        reminderTime: enableReminders ? reminderTimeString : undefined,
      });

      if (enableReminders) {
        await scheduleHabitReminder({
          body: 'Time to check in on your habit progress!',
          habitId: habitToEdit._id,
          reminderTime,
          skipPermissionCheck: true,
          title: fullName,
        });
      }
    } else {
      // Create new habit
      const habitId = await createHabit({
        name: fullName,
        notes: '',
        remindersEnabled: enableReminders,
        reminderSound: enableReminders ? reminderSound : undefined,
        reminderTime: enableReminders ? reminderTimeString : undefined,
      });

      if (enableReminders && habitId) {
        await scheduleHabitReminder({
          body: 'Time to check in on your habit progress!',
          habitId,
          reminderTime,
          skipPermissionCheck: true,
          title: fullName,
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
    closeTemplateBrowser();
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

          <ScrollView
            ref={(node) => {
              scrollViewRef.current = node;
            }}
            className='flex-1 px-4'
            contentContainerStyle={{ paddingBottom: isEditMode ? 32 : 160 }}
            keyboardShouldPersistTaps='handled'
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onScroll={handleMainScroll}
          >
            {/* Template Hub - Hero card and quick picks */}
            {!isEditMode && (
              <View className='mb-6 mt-2'>
                <TouchableOpacity
                  accessibilityLabel={
                    isTemplateBrowserOpen
                      ? 'Hide template browser'
                      : 'Start from template'
                  }
                  accessibilityRole='button'
                  activeOpacity={0.92}
                  className='flex-row items-center rounded-3xl bg-[#E8EDFF] px-[18px] py-4 shadow-lg shadow-black/10'
                  style={{ elevation: 3 }}
                  onPress={handleHeroPress}
                >
                  <View
                    className='mr-4 h-11 w-11 items-center justify-center rounded-full bg-white shadow-md shadow-black/10'
                    style={{ elevation: 2 }}
                  >
                    <BookOpen color='#111827' size={20} strokeWidth={2} />
                  </View>
                  <View className='h-[80px] flex-1'>
                    <Text className='text-lg font-bold text-[#111827]'>
                      Start from Template
                    </Text>
                    <Text className='mt-1 text-sm font-medium text-[#111827]/70'>
                      {isTemplateBrowserOpen
                        ? 'Hide template browser'
                        : 'Browse curated routines and auto-fill details.'}
                    </Text>
                  </View>
                  <Animated.View
                    style={{ transform: [{ rotate: chevronRotation }] }}
                  >
                    <ChevronRight color='#111827' size={18} strokeWidth={2.5} />
                  </Animated.View>
                </TouchableOpacity>
              </View>
            )}

            {isTemplateBrowserVisible && !isEditMode && (
              <Animated.View
                className='mb-6 overflow-hidden rounded-3xl bg-white shadow-lg shadow-black/10'
                pointerEvents={isTemplateBrowserOpen ? 'auto' : 'none'}
                style={[
                  {
                    elevation: 2,
                  },
                  {
                    opacity: templateBrowserAnim,
                    transform: [{ translateY: templateBrowserTranslate }],
                  },
                ]}
              >
                {/* Category Filters */}
                <ScrollView
                  horizontal
                  className='border-b border-gray-100'
                  contentContainerClassName='px-3 py-3 gap-2'
                  showsHorizontalScrollIndicator={false}
                >
                  {CATEGORIES.map((category) => {
                    const isSelected = selectedCategory === category.id;
                    return (
                      <Pressable
                        key={category.id}
                        accessibilityLabel={`Filter by ${category.label}`}
                        accessibilityRole='button'
                        accessibilityState={{ selected: isSelected }}
                        className={`flex-row items-center gap-1 rounded-full px-3 py-2 ${
                          isSelected ? 'bg-[#1a1a1a]' : 'bg-gray-100'
                        }`}
                        onPress={() => handleCategoryPress(category.id)}
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
                <View className='relative max-h-[300px]'>
                  {isLoadingTemplates ? (
                    <View className='items-center justify-center py-12'>
                      <ActivityIndicator color='#1a1a1a' size='small' />
                      <Text className='mt-2 text-sm text-[#8a8a8a]'>
                        Loading templates...
                      </Text>
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
                      showsVerticalScrollIndicator
                      data={filteredTemplates}
                      keyExtractor={(item) => item._id}
                      ListFooterComponent={() => (
                        <View className='px-4 pb-6 pt-3'>
                          <TouchableOpacity
                            accessibilityLabel='Hide template browser'
                            accessibilityRole='button'
                            className='flex-row items-center justify-center rounded-full bg-[#f4f4f4] px-4 py-2'
                            onPress={closeTemplateBrowser}
                          >
                            <Text className='mr-2 text-sm font-semibold text-[#1a1a1a]'>
                              Hide templates
                            </Text>
                            <ChevronDown color='#1a1a1a' size={16} />
                          </TouchableOpacity>
                        </View>
                      )}
                      renderItem={({ item }) => (
                        <View className='flex-row items-center gap-3 border-b border-gray-50 p-3'>
                          <Pressable
                            accessibilityLabel={`Select ${item.name} template`}
                            accessibilityRole='button'
                            className='flex-1 flex-row items-center gap-3'
                            onPress={() => handleTemplateSelect(item)}
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
                              <Text
                                className='text-base font-semibold text-[#1a1a1a]'
                                numberOfLines={1}
                              >
                                {item.name}
                              </Text>
                              <Text
                                className='text-xs text-[#8a8a8a]'
                                numberOfLines={2}
                              >
                                {item.description}
                              </Text>
                            </View>
                          </Pressable>

                          {/* Science Button */}
                          <TouchableOpacity
                            accessibilityLabel={`View science for ${item.name}`}
                            accessibilityRole='button'
                            className='h-9 w-9 items-center justify-center rounded-full bg-blue-50'
                            onPress={() => handleViewScience(item)}
                          >
                            <Microscope
                              color='#3B82F6'
                              size={16}
                              strokeWidth={2}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                      scrollEventThrottle={16}
                      onContentSizeChange={handleTemplateListContentSizeChange}
                      onLayout={handleTemplateListLayout}
                      onScroll={handleTemplateListScroll}
                    />
                  )}
                  {showTemplateTopShadow && (
                    <LinearGradient
                      colors={['rgba(255,255,255,0.96)', 'rgba(255,255,255,0)']}
                      pointerEvents='none'
                      style={{
                        height: 32,
                        left: 0,
                        position: 'absolute',
                        right: 0,
                        top: 0,
                      }}
                    />
                  )}
                  {showTemplateBottomShadow && (
                    <LinearGradient
                      colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.95)']}
                      pointerEvents='none'
                      style={{
                        alignItems: 'center',
                        bottom: 0,
                        height: 56,
                        justifyContent: 'flex-end',
                        left: 0,
                        paddingBottom: 4,
                        position: 'absolute',
                        right: 0,
                      }}
                    >
                      <View className='mb-1 flex-row items-center rounded-full bg-[rgba(26,26,26,0.08)] px-3 py-1.5'>
                        <ChevronDown color='#1a1a1a' size={16} />
                        <Text className='ml-1.5 text-xs font-semibold text-[#1a1a1a]'>
                          Scroll for more templates
                        </Text>
                      </View>
                    </LinearGradient>
                  )}
                </View>
              </Animated.View>
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
                blurOnSubmit
                autoFocus={visible && !isEditMode}
                className='h-14 rounded-xl bg-white px-4 text-base text-[#1a1a1a]'
                placeholder='Exercise'
                placeholderTextColor='#adaebc'
                returnKeyType='done'
                value={habitName}
                onChangeText={setHabitName}
              />
            </View>

            {/* Icon Picker */}
            <View className='mb-6'>
              <Text className='mb-3 text-base font-semibold text-[#1a1a1a]'>
                Icon
              </Text>
              <ScrollView
                horizontal
                className='flex-row'
                contentContainerClassName='gap-3'
                showsHorizontalScrollIndicator={false}
              >
                {/* No Icon Option */}
                <TouchableOpacity
                  accessibilityLabel='No icon'
                  accessibilityRole='button'
                  className='h-12 items-center justify-center rounded-xl bg-white px-3'
                  style={{
                    borderColor: '#1a1a1a',
                    borderWidth: selectedEmoji === null ? 2 : 0,
                  }}
                  onPress={() => setSelectedEmoji(null)}
                >
                  <Text className='text-xs font-medium text-[#8a8a8a]'>
                    None
                  </Text>
                </TouchableOpacity>

                {/* Emoji Options */}
                {EMOJIS.map((emoji, index) => (
                  <TouchableOpacity
                    key={index}
                    accessibilityLabel={`Select ${emoji} icon`}
                    accessibilityRole='button'
                    className='h-12 w-12 items-center justify-center rounded-xl bg-white'
                    style={{
                      borderColor: '#1a1a1a',
                      borderWidth: selectedEmoji === emoji ? 2 : 0,
                    }}
                    onPress={() => setSelectedEmoji(emoji)}
                  >
                    <Text className='text-2xl'>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
                <Text className='flex-1 text-sm font-medium text-[#1a1a1a]'>
                  Custom color
                </Text>
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
                  ios_backgroundColor='#E5E5E5'
                  thumbColor='#FFFFFF'
                  trackColor={{ false: '#E5E5E5', true: '#3B82F6' }}
                  value={remindersEnabled}
                  onValueChange={setRemindersEnabled}
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

          {shouldShowTemplateReminder && (
            <View
              className='absolute left-6 right-6'
              pointerEvents='box-none'
              style={{ bottom: reminderBottomOffset }}
            >
              <TouchableOpacity
                accessibilityLabel='Browse curated habit templates'
                accessibilityRole='button'
                activeOpacity={0.92}
                className='rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 shadow-lg shadow-black/10'
                style={{ elevation: 4 }}
                onPress={handleReminderPress}
              >
                <Text className='text-sm font-medium text-[#374151]'>
                  Prefer a ready-made routine?{' '}
                  <Text className='font-bold text-[#111827]'>
                    Browse curated templates
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Time Picker Modal */}
          {showTimePicker && (
            <DateTimePicker
              display='spinner'
              is24Hour={false}
              mode='time'
              value={reminderTime}
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
        onClose={() => setIsColorPickerVisible(false)}
        onSelect={setSelectedColor}
      />

      <TemplateScienceModal
        template={selectedTemplateForScience}
        visible={scienceModalVisible}
        onClose={() => setScienceModalVisible(false)}
        onUseTemplate={handleUseTemplateFromScience}
      />
    </Modal>
  );
}
