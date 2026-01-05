import { render, screen } from '@testing-library/react-native';
import { HabitsModals } from '../components/HabitsModals';
import type { HabitsModalsState } from '../hooks/useHabitsApp';

// Mock the modal components
jest.mock('../../../components/CreateHabitModal', () => ({
  __esModule: true,
  default: jest.fn(({ visible }) => {
    if (!visible) return null;
    return require('react-native').View({
      testID: 'create-habit-modal-original',
    });
  }),
}));

jest.mock('../../../components/CreateHabitModal/CreateHabitModalCentered', () => ({
  __esModule: true,
  default: jest.fn(({ visible }) => {
    if (!visible) return null;
    return require('react-native').View({
      testID: 'create-habit-modal-centered',
    });
  }),
}));

// Mock other dependencies
jest.mock('../../../components/SettingsModal', () => 'SettingsModal');
jest.mock('../../../components/HabitCalendarModal', () => 'HabitCalendarModal');
jest.mock('../../../screens/HabitDetailScreen', () => 'HabitDetailScreen');
jest.mock('../../../screens/HabitEditScreen', () => 'HabitEditScreen');
jest.mock('../../../components/Modal', () => 'CustomModal');
jest.mock('../../../components/PauseHabitModal', () => 'PauseHabitModal');
jest.mock('../../../components/HapticTest', () => 'HapticTest');
jest.mock('../../../screens/TemplatesScreen', () => 'TemplatesScreen');
jest.mock('../../../components/QuickActionsSheet', () => ({
  QuickActionsSheet: 'QuickActionsSheet',
}));
jest.mock('../../../components/VisualizationExercise', () => ({
  VisualizationExercise: 'VisualizationExercise',
}));
jest.mock('../../../components/MotivationSystem/Activation/ActivationModal', () => ({
  ActivationModal: 'ActivationModal',
}));

describe('HabitsModals - CreateHabit Integration', () => {
  const mockState: HabitsModalsState = {
    celebrationsEnabled: true,
    settings: {
      dayShape: 'square',
      habitCompletionIcon: 'chain',
      highContrastMode: false,
      showCharacterScreen: true,
      showNotesStats: true,
      showWeekCompletionBar: true,
      hasPremium: false,
    },
    showSettings: false,
    showCreateHabit: false,
    showEditScreen: false,
    showHabitCalendar: false,
    showHabitDetail: false,
    habitDetailInitialTab: 'overview',
    showHapticTest: false,
    showShareCard: false,
    showPauseModal: false,
    showTemplatesScreen: false,
    showQuickActions: false,
    showVisualizationExercise: false,
    showActivationModal: false,
    activationModalHabit: null,
    habitToEdit: null,
    habitToPause: null,
    selectedHabit: null,
    quickActionsHabit: null,
    shareCardData: null,
    tracking: [],
    showHabitStrengthPercentage: false,
    closeSettings: jest.fn(),
    openHapticTest: jest.fn(),
    closeHapticTest: jest.fn(),
    closeCreateHabit: jest.fn(),
    closeEditScreen: jest.fn(),
    closeHabitCalendar: jest.fn(),
    closeHabitDetail: jest.fn(),
    closeShareCard: jest.fn(),
    closePauseModal: jest.fn(),
    closeTemplatesScreen: jest.fn(),
    closeQuickActions: jest.fn(),
    closeVisualizationExercise: jest.fn(),
    openVisualizationExercise: jest.fn(),
    closeActivationModal: jest.fn(),
    setShowHabitStrengthPercentage: jest.fn(),
    onSettingsChange: jest.fn(),
    onDeleteHabit: jest.fn(),
    confirmPause: jest.fn(),
    toggleHabit: jest.fn(),
    getStreak: jest.fn(() => 0),
    openHabitDetail: jest.fn(),
    openHabitCalendar: jest.fn(),
    openEditHabit: jest.fn(),
    openPauseModal: jest.fn(),
    handleArchive: jest.fn(),
    onChangeCelebrationsEnabled: jest.fn(),
    reduceMotionPreference: false,
  };

  it('renders CreateHabitModal when showCreateHabit is true (feature flag disabled)', () => {
    const state = {
      ...mockState,
      showCreateHabit: true,
    };

    render(<HabitsModals state={state} />);

    // With feature flag disabled (USE_CENTERED_HABIT_MODAL = false),
    // should render the original modal
    expect(screen.queryByTestId('create-habit-modal-original')).toBeTruthy();
    expect(screen.queryByTestId('create-habit-modal-centered')).toBeNull();
  });

  it('does not render CreateHabitModal when showCreateHabit is false', () => {
    const state = {
      ...mockState,
      showCreateHabit: false,
    };

    render(<HabitsModals state={state} />);

    expect(screen.queryByTestId('create-habit-modal-original')).toBeNull();
    expect(screen.queryByTestId('create-habit-modal-centered')).toBeNull();
  });

  it('passes correct props to CreateHabitModal', () => {
    const CreateHabitModal = require('../../../components/CreateHabitModal').default;
    const mockHabit = {
      _id: 'habit-1',
      _creationTime: Date.now(),
      userId: 'user-1',
      name: 'Test Habit',
      icon: '📚',
      color: '#EF4444',
      timeOfDay: 'afternoon' as const,
      days: [0, 1, 2, 3, 4, 5, 6],
      createdAt: new Date().toISOString(),
      archived: false,
      paused: false,
    };

    const state = {
      ...mockState,
      showCreateHabit: true,
      habitToEdit: mockHabit,
    };

    render(<HabitsModals state={state} />);

    expect(CreateHabitModal).toHaveBeenCalledWith(
      expect.objectContaining({
        visible: true,
        habitToEdit: mockHabit,
        onClose: mockState.closeCreateHabit,
      }),
      expect.anything()
    );
  });
});
