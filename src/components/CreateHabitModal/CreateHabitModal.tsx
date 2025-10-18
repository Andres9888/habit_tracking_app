import { useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Sparkles, Check } from 'lucide-react-native';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface CreateHabitModalProps {
  visible: boolean;
  onClose: () => void;
}

const QUICK_TEMPLATES = [
  {
    emoji: '🧘',
    name: 'Morning Meditation',
    description: 'Start your day with mindfulness',
  },
  { emoji: '📚', name: 'Daily Reading', description: 'Read for 30 minutes' },
  { emoji: '💪', name: 'Exercise', description: 'Work out regularly' },
  { emoji: '💧', name: 'Drink Water', description: 'Stay hydrated' },
  { emoji: '✍️', name: 'Journaling', description: 'Reflect on your day' },
  {
    emoji: '🧠',
    name: 'Learn Something New',
    description: 'Continuous learning',
  },
];

const EMOJI_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'health', label: 'Health' },
  { id: 'learning', label: 'Learning' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'creative', label: 'Creative' },
  { id: 'personal', label: 'Personal' },
];

const EMOJIS = [
  '🧘',
  '📚',
  '💪',
  '🏃',
  '🎨',
  '✍️',
  '🎵',
  '💧',
  '🌱',
  '🧠',
  '❤️',
  '🎯',
  '☀️',
  '😴',
  '🥗',
  '🚴',
];

const COLORS = [
  '#4ade80', // green
  '#60a5fa', // blue
  '#fbbf24', // amber
  '#ec4899', // pink
  '#a855f7', // violet
  '#14b8a6', // teal
  '#f97316', // orange
  '#06b6d4', // cyan
];

export default function CreateHabitModal({
  visible,
  onClose,
}: CreateHabitModalProps) {
  const [habitName, setHabitName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🧘');
  const [selectedColor, setSelectedColor] = useState('#4ade80');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTips, setShowTips] = useState(true);

  const createHabit = useMutation(api.habits.create);

  const handleTemplateSelect = (template: (typeof QUICK_TEMPLATES)[0]) => {
    setHabitName(template.name);
    setSelectedEmoji(template.emoji);
  };

  const handleCreate = async () => {
    if (!habitName.trim()) return;

    await createHabit({
      name: `${selectedEmoji} ${habitName}`,
      notes: '',
    });

    // Reset and close
    setHabitName('');
    setSelectedEmoji('🧘');
    setSelectedColor('#4ade80');
    onClose();
  };

  const charCount = habitName.length;
  const maxChars = 50;

  return (
    <Modal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 bg-black/50'>
        <View className='mt-12 flex-1 overflow-hidden rounded-t-3xl bg-white shadow-2xl'>
          {/* Header with gradient */}
          <LinearGradient
            colors={['#f472b6', '#a855f7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className='px-6 pb-4 pt-12'
          >
            <View className='flex-row items-center justify-between'>
              <View className='flex-row items-center gap-3'>
                <View className='h-10 w-10 items-center justify-center rounded-full bg-white/20'>
                  <Sparkles color='#ffffff' size={20} strokeWidth={2.25} />
                </View>
                <Text className='text-[28px] font-semibold leading-[42px] tracking-[0.38px] text-white'>
                  Create Habit
                </Text>
              </View>
              <TouchableOpacity
                accessibilityLabel='Close'
                accessibilityRole='button'
                className='h-9 w-9 items-center justify-center rounded-full bg-white/20'
                onPress={onClose}
              >
                <X color='#ffffff' size={20} strokeWidth={2.25} />
              </TouchableOpacity>
            </View>
            <Text className='mt-3 text-sm leading-5 tracking-[-0.15px] text-white/90'>
              Build a new positive routine
            </Text>
          </LinearGradient>

          <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
            {/* Preview Section */}
            <View className='border-b border-slate-200/30 bg-slate-100/30 px-6 pb-6 pt-6'>
              <View className='rounded-2xl border border-slate-200/50 bg-white p-4 shadow-sm'>
                <View className='mb-3 flex-row items-center justify-between'>
                  <Text className='text-xs font-medium uppercase tracking-[2px] text-slate-500'>
                    Preview
                  </Text>
                  <View className='flex-row items-center gap-1.5 rounded-lg border border-green-200 bg-slate-100 px-2.5 py-1'>
                    <Check color='#00c950' size={12} strokeWidth={2.5} />
                    <Text className='text-xs font-medium text-slate-900'>
                      Live
                    </Text>
                  </View>
                </View>
                <View className='flex-row items-center gap-4'>
                  <View
                    className='h-14 w-14 items-center justify-center rounded-2xl shadow-lg'
                    style={{ backgroundColor: selectedColor }}
                  >
                    <Text className='text-2xl leading-8'>{selectedEmoji}</Text>
                  </View>
                  <View className='flex-1'>
                    <Text className='text-lg font-semibold leading-7 tracking-[-0.44px] text-slate-900'>
                      {habitName || 'Your Habit Name'}
                    </Text>
                    <View className='flex-row items-center gap-2'>
                      <View
                        className='h-2 w-2 rounded-full'
                        style={{ backgroundColor: selectedColor }}
                      />
                      <Text className='text-sm leading-5 tracking-[-0.15px] text-slate-500'>
                        Ready to track
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Quick Templates */}
            <View className='border-b border-slate-200/30 px-6 pb-5 pt-4'>
              <View className='mb-3 flex-row items-center justify-between'>
                <Text className='text-sm font-medium leading-5 tracking-[-0.15px] text-slate-900'>
                  Quick Templates
                </Text>
                <View className='rounded-lg border border-slate-200 px-2.5 py-1'>
                  <Text className='text-xs font-medium text-slate-900'>
                    Popular
                  </Text>
                </View>
              </View>
              <View className='gap-2'>
                {QUICK_TEMPLATES.slice(0, 4).map((template, index) => (
                  <TouchableOpacity
                    key={index}
                    className='rounded-xl border border-slate-200/50 bg-slate-50/50 p-3.5'
                    onPress={() => handleTemplateSelect(template)}
                  >
                    <View className='flex-row items-center gap-2'>
                      <Text className='text-lg leading-7 tracking-[-0.44px]'>
                        {template.emoji}
                      </Text>
                      <View className='flex-1'>
                        <Text className='text-sm font-medium leading-5 tracking-[-0.15px] text-slate-900'>
                          {template.name}
                        </Text>
                        <Text className='text-[10px] leading-[15px] tracking-[0.12px] text-slate-500'>
                          {template.description}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Habit Name Input */}
            <View className='px-6 pb-4 pt-4'>
              <View className='mb-3 flex-row items-center gap-2'>
                <Text className='text-sm font-medium tracking-[-0.15px] text-slate-900'>
                  Habit Name
                </Text>
                <Text className='text-xs text-slate-500'>(required)</Text>
              </View>
              <TextInput
                className='rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-normal text-slate-900'
                placeholder='e.g., Morning meditation'
                placeholderTextColor='#71717a'
                value={habitName}
                maxLength={maxChars}
                onChangeText={setHabitName}
              />
              <Text className='mt-2 text-xs text-slate-500'>
                {charCount}/{maxChars} characters
              </Text>
            </View>

            {/* Emoji Picker */}
            <View className='px-6 pb-4 pt-4'>
              <View className='mb-3 flex-row items-center justify-between'>
                <Text className='text-sm font-medium tracking-[-0.15px] text-slate-900'>
                  Choose Icon
                </Text>
                <View className='flex-row gap-1'>
                  {EMOJI_CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      className={`rounded-lg px-2 py-1 ${
                        selectedCategory === category.id
                          ? 'bg-slate-900'
                          : 'bg-slate-200'
                      }`}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <Text
                        className={`text-[10px] font-medium tracking-[0.12px] ${
                          selectedCategory === category.id
                            ? 'text-white'
                            : 'text-slate-500'
                        }`}
                      >
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View className='flex-row flex-wrap gap-2'>
                {EMOJIS.map((emoji, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`h-[60px] w-[45px] items-center justify-center rounded-xl border-2 ${
                      selectedEmoji === emoji
                        ? 'border-slate-900 bg-slate-100/50'
                        : 'border-slate-200'
                    }`}
                    onPress={() => setSelectedEmoji(emoji)}
                  >
                    <Text className='text-2xl leading-8 tracking-[0.07px]'>
                      {emoji}
                    </Text>
                    {selectedEmoji === emoji && (
                      <View className='absolute -right-0.5 -top-0.5 h-[18px] w-[18px] items-center justify-center rounded-full bg-slate-900'>
                        <Check color='#ffffff' size={11} strokeWidth={2.5} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Color Picker */}
            <View className='px-6 pb-4 pt-4'>
              <View className='mb-3 flex-row items-center justify-between'>
                <Text className='text-sm font-medium tracking-[-0.15px] text-slate-900'>
                  Choose Color
                </Text>
                <Text className='text-xs text-slate-500'>
                  {selectedColor === '#4ade80' ? 'Green' : 'Custom'}
                </Text>
              </View>
              <View className='flex-row gap-2.5'>
                {COLORS.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`h-8 w-8 items-center justify-center rounded-xl border-2 ${
                      selectedColor === color
                        ? 'border-slate-900'
                        : 'border-slate-200'
                    }`}
                    style={{ backgroundColor: color }}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Check color='#ffffff' size={18} strokeWidth={2.5} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Pro Tips Section */}
            {showTips && (
              <View className='px-6 pb-6 pt-4'>
                <TouchableOpacity
                  className='mb-3 flex-row items-center justify-between'
                  onPress={() => setShowTips(!showTips)}
                >
                  <View className='flex-row items-center gap-2'>
                    <Sparkles color='#a855f7' size={16} strokeWidth={2} />
                    <Text className='text-sm font-medium tracking-[-0.15px] text-slate-900'>
                      Pro Tips for Success
                    </Text>
                  </View>
                </TouchableOpacity>
                <View className='gap-3'>
                  <View className='rounded-xl border border-blue-100 bg-blue-50 p-3.5'>
                    <View className='flex-row gap-3'>
                      <View className='h-8 w-8 items-center justify-center rounded-xl bg-white'>
                        <Text className='text-lg'>🎯</Text>
                      </View>
                      <View className='flex-1'>
                        <Text className='text-sm font-medium leading-5 tracking-[-0.15px] text-slate-900'>
                          Be Specific
                        </Text>
                        <Text className='mt-0.5 text-xs leading-4 text-slate-600'>
                          Instead of "Exercise", try "30 min morning jog"
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className='rounded-xl border border-green-100 bg-green-50 p-3.5'>
                    <View className='flex-row gap-3'>
                      <View className='h-8 w-8 items-center justify-center rounded-xl bg-white'>
                        <Text className='text-lg'>🌱</Text>
                      </View>
                      <View className='flex-1'>
                        <Text className='text-sm font-medium leading-5 tracking-[-0.15px] text-slate-900'>
                          Start Small
                        </Text>
                        <Text className='mt-0.5 text-xs leading-4 text-slate-600'>
                          Begin with habits you can do in 2 minutes or less
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className='rounded-xl border border-purple-100 bg-purple-50 p-3.5'>
                    <View className='flex-row gap-3'>
                      <View className='h-8 w-8 items-center justify-center rounded-xl bg-white'>
                        <Text className='text-lg'>🔗</Text>
                      </View>
                      <View className='flex-1'>
                        <Text className='text-sm font-medium leading-5 tracking-[-0.15px] text-slate-900'>
                          Stack Habits
                        </Text>
                        <Text className='mt-0.5 text-xs leading-4 text-slate-600'>
                          Link new habits to existing routines
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Bottom Padding */}
            <View className='h-24' />
          </ScrollView>

          {/* Create Button */}
          <View className='border-t border-slate-200 bg-white px-6 pb-8 pt-4'>
            <TouchableOpacity
              accessibilityRole='button'
              className={`items-center justify-center rounded-2xl px-6 py-4 ${
                habitName.trim().length > 0
                  ? 'bg-slate-900'
                  : 'bg-slate-300 opacity-50'
              }`}
              disabled={habitName.trim().length === 0}
              onPress={handleCreate}
            >
              <Text className='text-base font-semibold text-white'>
                Create Habit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
