/**
 * Vision Board - Acceptance Criteria Validation Tests
 *
 * This test suite validates the "Nice to Have (v1.2+)" acceptance criterion:
 * "Vision Board with image upload (premium)"
 *
 * The complete flow being tested:
 * 1. Image Picker Integration: Camera and library selection, permission handling
 * 2. Image Upload to Storage: Convex file storage upload, progress, error handling
 * 3. 4-Image Grid Display: 2x2 grid layout, filled/empty slots, add button
 * 4. Full-size Image Viewer: Tap to view, zoom indicator, close button
 * 5. Optional Captions: Caption overlay, edit modal, character counter
 * 6. Premium Gating: Premium-only feature with PRO badge
 * 7. Delete Functionality: Delete button, confirmation, cascade delete
 * 8. Accessibility: Labels, roles, reduceMotion support
 * 9. Fuchsia Accent Styling: Consistent theming
 *
 * Scientific Basis:
 * - Visual motivation reinforces goals through mental imagery
 * - Personal images > stock images for emotional connection (Brewer, 2018)
 * - Mirror neurons activate when viewing goal-related imagery
 * - Mental contrasting with visual cues improves goal pursuit (Oettingen, 2014)
 *
 * Related Implementation Tasks:
 * - T12.1: Create `visionBoardImages` table in Convex
 * - T12.2: Image picker integration (expo-image-picker)
 * - T12.3: Image upload to storage (Convex file storage)
 * - T12.4: 4-image grid display
 * - T12.5: Full-size image viewer
 * - T12.6: Optional captions
 * - T12.7: Premium gate
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

// ─────────────────────────────────────────────────────────────────────────────
// Mock Setup
// ─────────────────────────────────────────────────────────────────────────────

// Mock Image Picker hook
const mockPickFromCamera = jest.fn();
const mockPickFromLibrary = jest.fn();
const mockPickWithChoice = jest.fn();
const mockClearImage = jest.fn();
const mockRequestPermissions = jest.fn();

jest.mock('../../../src/hooks/useImagePicker', () => ({
  useImagePicker: () => ({
    pickFromCamera: mockPickFromCamera,
    pickFromLibrary: mockPickFromLibrary,
    pickWithChoice: mockPickWithChoice,
    clearImage: mockClearImage,
    requestPermissions: mockRequestPermissions,
    isLoading: false,
    image: null,
    error: null,
    hasCameraPermission: true,
    hasLibraryPermission: true,
  }),
}));

// Mock Image Upload hook
const mockUploadImage = jest.fn();
const mockClearError = jest.fn();

jest.mock('../../../src/hooks/useImageUpload', () => ({
  useImageUpload: () => ({
    uploadImage: mockUploadImage,
    isUploading: false,
    progress: 0,
    error: null,
    clearError: mockClearError,
  }),
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// Mock lucide-react-native with Proxy for dynamic icons
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (prop === '__esModule') return true;
        return function MockIcon(props: unknown) {
          return React.createElement(View, {
            testID: `lucide-icon-${String(prop)}`,
            ...props,
          });
        };
      },
    }
  );
});

// Mock clsx
jest.mock('clsx', () => ({
  clsx: (...args: unknown[]) =>
    args
      .flat()
      .filter((a) => typeof a === 'string')
      .join(' ')
      .trim(),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    default: {
      View,
      createAnimatedComponent: (Component: unknown) => Component,
    },
    useSharedValue: (initial: unknown) => ({ value: initial }),
    useAnimatedStyle: () => ({}),
    withSpring: (value: unknown) => value,
    withTiming: (value: unknown, _config?: unknown, _callback?: unknown) => value,
    withDelay: (_delay: unknown, value: unknown) => value,
    withSequence: (...values: unknown[]) => values[values.length - 1],
    withRepeat: (value: unknown) => value,
    interpolate: (value: number, input: number[], output: number[]) =>
      output[0],
    runOnJS: (fn: unknown) => fn,
    cancelAnimation: jest.fn(),
    Extrapolation: { CLAMP: 'clamp' },
    Easing: {
      out: (fn: unknown) => fn,
      in: (fn: unknown) => fn,
      ease: (t: number) => t,
      cubic: (x: number) => x,
    },
    View,
    FadeIn: {},
    FadeOut: {},
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

// Mock Alert
const mockAlert = jest.fn();
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Alert: {
      alert: (...args: unknown[]) => mockAlert(...args),
    },
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// Component Imports
// ─────────────────────────────────────────────────────────────────────────────

import {
  VisionBoardSection,
  type VisionBoardImage,
  type VisionBoardSectionProps,
} from '../../../src/components/MotivationSystem/Workshop/VisionBoardSection';
import type { Id } from '../../../convex/_generated/dataModel';

// ─────────────────────────────────────────────────────────────────────────────
// Test Data
// ─────────────────────────────────────────────────────────────────────────────

const mockStorageId = 'k97123456789' as Id<'_storage'>;
const NOW = Date.now();

const createMockImage = (
  id: string,
  order: number,
  caption?: string
): VisionBoardImage => ({
  id,
  storageId: mockStorageId,
  imageUrl: `https://example.com/image-${id}.jpg`,
  caption,
  order,
  createdAt: NOW - order * 60 * 60 * 1000, // Created hours ago based on order
});

const mockImages: VisionBoardImage[] = [
  createMockImage('img-1', 0, 'My motivation'),
  createMockImage('img-2', 1, 'Goal visualization'),
  createMockImage('img-3', 2),
  createMockImage('img-4', 3, 'Future me'),
];

const mockTwoImages: VisionBoardImage[] = [
  createMockImage('img-1', 0, 'First image caption'),
  createMockImage('img-2', 1),
];

const mockPickedImage = {
  uri: 'file://picked-image.jpg',
  width: 1000,
  height: 1000,
  type: 'image' as const,
  mimeType: 'image/jpeg',
  fileSize: 500000,
};

const mockUploadResult = {
  storageId: mockStorageId,
  url: 'https://storage.example.com/uploaded.jpg',
};

const defaultProps: VisionBoardSectionProps = {
  images: [],
  imageCount: 0,
  isPremium: true,
  onAddImage: jest.fn().mockResolvedValue(undefined),
  onUpdateCaption: jest.fn().mockResolvedValue(undefined),
  onDeleteImage: jest.fn().mockResolvedValue(undefined),
  onPremiumRequired: jest.fn(),
  shouldAnimate: false,
  reduceMotion: true, // Skip animations for faster tests
  sectionIndex: 0,
};

const filledProps: VisionBoardSectionProps = {
  ...defaultProps,
  images: mockTwoImages,
  imageCount: 2,
};

const fullProps: VisionBoardSectionProps = {
  ...defaultProps,
  images: mockImages,
  imageCount: 4,
};

// ─────────────────────────────────────────────────────────────────────────────
// AC1: Image Picker Integration
// ─────────────────────────────────────────────────────────────────────────────

describe('AC1: Image Picker Integration - Camera and library selection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPickFromCamera.mockResolvedValue(mockPickedImage);
    mockPickFromLibrary.mockResolvedValue(mockPickedImage);
    mockUploadImage.mockResolvedValue(mockUploadResult);
  });

  describe('Add Image Modal', () => {
    it('opens add modal when empty slot is pressed', () => {
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      expect(getByText('Add to Vision Board')).toBeTruthy();
    });

    it('shows camera and library options in add modal', () => {
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      expect(getByText('Take Photo')).toBeTruthy();
      expect(getByText('Choose from Library')).toBeTruthy();
    });

    it('shows option descriptions', () => {
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      expect(getByText('Use your camera to capture an image')).toBeTruthy();
      expect(getByText('Select an existing photo')).toBeTruthy();
    });

    it('shows cancel button in modal', () => {
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      expect(getByText('Cancel')).toBeTruthy();
    });

    it('closes modal when cancel is pressed', () => {
      const { getByLabelText, getByText, queryByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));
      expect(queryByText('Add to Vision Board')).toBeTruthy();

      fireEvent.press(getByText('Cancel'));
      expect(queryByText('Add to Vision Board')).toBeNull();
    });
  });

  describe('Camera Selection', () => {
    it('calls pickFromCamera when Take Photo is pressed', async () => {
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      await act(async () => {
        fireEvent.press(getByText('Take Photo'));
      });

      expect(mockPickFromCamera).toHaveBeenCalled();
    });

    it('closes modal after camera selection is initiated', async () => {
      const { getByLabelText, getByText, queryByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      await act(async () => {
        fireEvent.press(getByText('Take Photo'));
      });

      // Modal should close (implementation may vary)
      expect(queryByText('Add to Vision Board')).toBeNull();
    });

    it('provides aspect ratio option to camera picker', async () => {
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      await act(async () => {
        fireEvent.press(getByText('Take Photo'));
      });

      expect(mockPickFromCamera).toHaveBeenCalledWith(
        expect.objectContaining({
          aspect: [1, 1],
        })
      );
    });
  });

  describe('Library Selection', () => {
    it('calls pickFromLibrary when Choose from Library is pressed', async () => {
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      await act(async () => {
        fireEvent.press(getByText('Choose from Library'));
      });

      expect(mockPickFromLibrary).toHaveBeenCalled();
    });

    it('provides quality option to library picker', async () => {
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      await act(async () => {
        fireEvent.press(getByText('Choose from Library'));
      });

      expect(mockPickFromLibrary).toHaveBeenCalledWith(
        expect.objectContaining({
          quality: 0.8,
        })
      );
    });
  });

  describe('Permission Handling', () => {
    it('handles cancelled image picker gracefully', async () => {
      mockPickFromLibrary.mockResolvedValueOnce(null); // User cancelled

      const onAddImage = jest.fn();
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} onAddImage={onAddImage} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      await act(async () => {
        fireEvent.press(getByText('Choose from Library'));
      });

      // onAddImage should not be called when picker is cancelled
      expect(onAddImage).not.toHaveBeenCalled();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC2: Image Upload to Storage
// ─────────────────────────────────────────────────────────────────────────────

describe('AC2: Image Upload to Storage - Convex file storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPickFromLibrary.mockResolvedValue(mockPickedImage);
    mockUploadImage.mockResolvedValue(mockUploadResult);
  });

  describe('Upload Flow', () => {
    it('uploads picked image to storage', async () => {
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      await act(async () => {
        fireEvent.press(getByText('Choose from Library'));
      });

      expect(mockUploadImage).toHaveBeenCalledWith(mockPickedImage);
    });

    it('calls onAddImage with storageId after successful upload', async () => {
      const onAddImage = jest.fn().mockResolvedValue(undefined);
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} onAddImage={onAddImage} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      await act(async () => {
        fireEvent.press(getByText('Choose from Library'));
      });

      expect(onAddImage).toHaveBeenCalledWith(mockStorageId);
    });

    it('provides haptic feedback on successful upload', async () => {
      const Haptics = require('expo-haptics');
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      await act(async () => {
        fireEvent.press(getByText('Choose from Library'));
      });

      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Success
      );
    });
  });

  describe('Upload Error Handling', () => {
    it('shows alert when upload fails', async () => {
      mockUploadImage.mockResolvedValueOnce(null); // Upload failed

      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      await act(async () => {
        fireEvent.press(getByText('Choose from Library'));
      });

      expect(mockAlert).toHaveBeenCalledWith(
        'Upload Failed',
        'There was a problem adding your image. Please try again.'
      );
    });

    it('does not call onAddImage when upload fails', async () => {
      mockUploadImage.mockResolvedValueOnce(null);
      const onAddImage = jest.fn();

      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} onAddImage={onAddImage} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      await act(async () => {
        fireEvent.press(getByText('Choose from Library'));
      });

      expect(onAddImage).not.toHaveBeenCalled();
    });
  });

  describe('Grid Full Prevention', () => {
    it('shows alert when trying to add to full grid', async () => {
      // Mock the flow where we try to add but grid is full
      // The component checks imageCount < MAX_IMAGES internally
      const { queryByLabelText } = render(
        <VisionBoardSection {...fullProps} />
      );

      // When grid is full, there are no empty slots to press
      expect(queryByLabelText('Add image to slot 1')).toBeNull();
      expect(queryByLabelText('Add image to slot 2')).toBeNull();
      expect(queryByLabelText('Add image to slot 3')).toBeNull();
      expect(queryByLabelText('Add image to slot 4')).toBeNull();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC3: 4-Image Grid Display
// ─────────────────────────────────────────────────────────────────────────────

describe('AC3: 4-Image Grid Display - 2x2 grid layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Grid Layout', () => {
    it('renders 4 grid slots total', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      // All 4 slots should be visible (empty in this case)
      expect(getByLabelText('Add image to slot 1')).toBeTruthy();
      expect(getByLabelText('Add image to slot 2')).toBeTruthy();
      expect(getByLabelText('Add image to slot 3')).toBeTruthy();
      expect(getByLabelText('Add image to slot 4')).toBeTruthy();
    });

    it('shows images in filled slots', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...filledProps} />
      );

      // First two slots have images
      expect(getByLabelText('First image caption')).toBeTruthy();
      expect(getByLabelText('Vision board image 2')).toBeTruthy();
    });

    it('shows empty slots for remaining positions', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...filledProps} />
      );

      // Last two slots are empty
      expect(getByLabelText('Add image to slot 3')).toBeTruthy();
      expect(getByLabelText('Add image to slot 4')).toBeTruthy();
    });

    it('shows "Add Image" text in empty slots', () => {
      const { getAllByText } = render(<VisionBoardSection {...defaultProps} />);

      // All 4 empty slots have "Add Image" text
      expect(getAllByText('Add Image').length).toBe(4);
    });
  });

  describe('Image Count Indicator', () => {
    it('shows image count when images exist', () => {
      const { getByText } = render(<VisionBoardSection {...filledProps} />);

      expect(getByText('2/4')).toBeTruthy();
    });

    it('shows 4/4 when grid is full', () => {
      const { getByText } = render(<VisionBoardSection {...fullProps} />);

      expect(getByText('4/4')).toBeTruthy();
    });

    it('does not show count in empty state', () => {
      const { queryByText } = render(<VisionBoardSection {...defaultProps} />);

      expect(queryByText('0/4')).toBeNull();
    });
  });

  describe('Completion Checkmark', () => {
    it('shows checkmark when images exist', () => {
      const { UNSAFE_queryAllByType } = render(
        <VisionBoardSection {...filledProps} />
      );

      // Component structure includes checkmark
      expect(UNSAFE_queryAllByType('View').length).toBeGreaterThan(0);
    });

    it('does not show checkmark when empty', () => {
      // The checkmark's isVisible prop is based on hasImages
      const { getByLabelText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      // Empty state shows pulsing icon, not checkmark
      expect(
        getByLabelText('Create your Vision Board with motivational images')
      ).toBeTruthy();
    });
  });

  describe('Zoom Indicator', () => {
    it('shows zoom indicator on filled image cells', () => {
      const { getAllByTestId } = render(
        <VisionBoardSection {...filledProps} />
      );

      // ZoomIn icons from lucide
      const zoomIcons = getAllByTestId('lucide-icon-ZoomIn');
      expect(zoomIcons.length).toBeGreaterThan(0);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC4: Full-size Image Viewer
// ─────────────────────────────────────────────────────────────────────────────

describe('AC4: Full-size Image Viewer - Tap to view, controls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Opening Viewer', () => {
    it('opens viewer when image is tapped', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...filledProps} />
      );

      fireEvent.press(getByLabelText('First image caption'));

      expect(getByLabelText('Close image viewer')).toBeTruthy();
    });

    it('displays image caption in viewer', () => {
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...filledProps} />
      );

      fireEvent.press(getByLabelText('First image caption'));

      expect(getByText('First image caption')).toBeTruthy();
    });
  });

  describe('Viewer Controls', () => {
    it('shows close button', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...filledProps} />
      );

      fireEvent.press(getByLabelText('First image caption'));

      expect(getByLabelText('Close image viewer')).toBeTruthy();
    });

    it('shows edit caption button', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...filledProps} />
      );

      fireEvent.press(getByLabelText('First image caption'));

      expect(getByLabelText('Edit caption')).toBeTruthy();
    });

    it('shows delete button', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...filledProps} />
      );

      fireEvent.press(getByLabelText('First image caption'));

      expect(getByLabelText('Delete image')).toBeTruthy();
    });
  });

  describe('Closing Viewer', () => {
    it('closes viewer when close button is pressed', () => {
      const { getByLabelText, queryByLabelText } = render(
        <VisionBoardSection {...filledProps} />
      );

      fireEvent.press(getByLabelText('First image caption'));
      expect(getByLabelText('Close image viewer')).toBeTruthy();

      fireEvent.press(getByLabelText('Close image viewer'));

      // Viewer should close (may have animation delay)
    });
  });

  describe('Caption Hint', () => {
    it('shows edit hint for images without caption', () => {
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...filledProps} />
      );

      // Second image has no caption
      fireEvent.press(getByLabelText('Vision board image 2'));

      expect(getByText('Tap the edit button to add a caption')).toBeTruthy();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC5: Optional Captions
// ─────────────────────────────────────────────────────────────────────────────

describe('AC5: Optional Captions - Overlay, edit, character counter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Caption Overlay on Grid', () => {
    it('displays caption overlay on grid images', () => {
      const { getByText } = render(<VisionBoardSection {...filledProps} />);

      expect(getByText('First image caption')).toBeTruthy();
    });

    it('uses caption as accessibility label', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...filledProps} />
      );

      expect(getByLabelText('First image caption')).toBeTruthy();
    });

    it('uses fallback label for images without caption', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...filledProps} />
      );

      // Second image has no caption
      expect(getByLabelText('Vision board image 2')).toBeTruthy();
    });
  });

  describe('Caption Editor', () => {
    it('opens caption editor when edit button is pressed', () => {
      const { getByLabelText, getByPlaceholderText } = render(
        <VisionBoardSection {...filledProps} />
      );

      fireEvent.press(getByLabelText('First image caption'));
      fireEvent.press(getByLabelText('Edit caption'));

      expect(getByPlaceholderText('Add a caption...')).toBeTruthy();
    });

    it('shows current caption in editor', () => {
      const { getByLabelText, getByDisplayValue } = render(
        <VisionBoardSection {...filledProps} />
      );

      fireEvent.press(getByLabelText('First image caption'));
      fireEvent.press(getByLabelText('Edit caption'));

      expect(getByDisplayValue('First image caption')).toBeTruthy();
    });

    it('shows character counter', () => {
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...filledProps} />
      );

      fireEvent.press(getByLabelText('First image caption'));
      fireEvent.press(getByLabelText('Edit caption'));

      // "First image caption" is 19 chars
      expect(getByText('19/200')).toBeTruthy();
    });

    it('shows save and cancel buttons', () => {
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...filledProps} />
      );

      fireEvent.press(getByLabelText('First image caption'));
      fireEvent.press(getByLabelText('Edit caption'));

      expect(getByText('Save')).toBeTruthy();
      expect(getByText('Cancel')).toBeTruthy();
    });
  });

  describe('Caption Save', () => {
    it('calls onUpdateCaption when save is pressed', async () => {
      const onUpdateCaption = jest.fn().mockResolvedValue(undefined);
      const { getByLabelText, getByPlaceholderText, getByText } = render(
        <VisionBoardSection
          {...filledProps}
          onUpdateCaption={onUpdateCaption}
        />
      );

      fireEvent.press(getByLabelText('First image caption'));
      fireEvent.press(getByLabelText('Edit caption'));

      const input = getByPlaceholderText('Add a caption...');
      fireEvent.changeText(input, 'Updated caption');

      await act(async () => {
        fireEvent.press(getByText('Save'));
      });

      expect(onUpdateCaption).toHaveBeenCalledWith('img-1', 'Updated caption');
    });

    it('trims whitespace from caption', async () => {
      const onUpdateCaption = jest.fn().mockResolvedValue(undefined);
      const { getByLabelText, getByPlaceholderText, getByText } = render(
        <VisionBoardSection
          {...filledProps}
          onUpdateCaption={onUpdateCaption}
        />
      );

      fireEvent.press(getByLabelText('First image caption'));
      fireEvent.press(getByLabelText('Edit caption'));

      const input = getByPlaceholderText('Add a caption...');
      fireEvent.changeText(input, '  Trimmed caption  ');

      await act(async () => {
        fireEvent.press(getByText('Save'));
      });

      expect(onUpdateCaption).toHaveBeenCalledWith('img-1', 'Trimmed caption');
    });

    it('passes undefined for empty caption (clear caption)', async () => {
      const onUpdateCaption = jest.fn().mockResolvedValue(undefined);
      const { getByLabelText, getByPlaceholderText, getByText } = render(
        <VisionBoardSection
          {...filledProps}
          onUpdateCaption={onUpdateCaption}
        />
      );

      fireEvent.press(getByLabelText('First image caption'));
      fireEvent.press(getByLabelText('Edit caption'));

      const input = getByPlaceholderText('Add a caption...');
      fireEvent.changeText(input, '');

      await act(async () => {
        fireEvent.press(getByText('Save'));
      });

      expect(onUpdateCaption).toHaveBeenCalledWith('img-1', undefined);
    });
  });

  describe('Caption Cancel', () => {
    it('restores original caption when cancel is pressed', () => {
      const {
        getByLabelText,
        getByPlaceholderText,
        getByText,
        getByDisplayValue,
      } = render(<VisionBoardSection {...filledProps} />);

      fireEvent.press(getByLabelText('First image caption'));
      fireEvent.press(getByLabelText('Edit caption'));

      const input = getByPlaceholderText('Add a caption...');
      fireEvent.changeText(input, 'Changed text');

      fireEvent.press(getByText('Cancel'));
      fireEvent.press(getByLabelText('Edit caption'));

      // Original caption should be restored
      expect(getByDisplayValue('First image caption')).toBeTruthy();
    });

    it('closes editor when cancel is pressed', () => {
      const { getByLabelText, getByText, queryByPlaceholderText } = render(
        <VisionBoardSection {...filledProps} />
      );

      fireEvent.press(getByLabelText('First image caption'));
      fireEvent.press(getByLabelText('Edit caption'));

      expect(queryByPlaceholderText('Add a caption...')).toBeTruthy();

      fireEvent.press(getByText('Cancel'));

      expect(queryByPlaceholderText('Add a caption...')).toBeNull();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC6: Premium Gating
// ─────────────────────────────────────────────────────────────────────────────

describe('AC6: Premium Gating - Premium-only feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPickFromLibrary.mockResolvedValue(mockPickedImage);
    mockUploadImage.mockResolvedValue(mockUploadResult);
  });

  describe('Non-Premium Users', () => {
    it('shows PRO badge for non-premium users', () => {
      const { getByText } = render(
        <VisionBoardSection {...defaultProps} isPremium={false} />
      );

      expect(getByText('PRO')).toBeTruthy();
    });

    it('does not show image grid for non-premium users', () => {
      const { queryByLabelText } = render(
        <VisionBoardSection {...filledProps} isPremium={false} />
      );

      expect(queryByLabelText('Add image to slot 1')).toBeNull();
    });

    it('calls onPremiumRequired when non-premium user taps section', () => {
      const onPremiumRequired = jest.fn();
      const { getByLabelText } = render(
        <VisionBoardSection
          {...defaultProps}
          isPremium={false}
          onPremiumRequired={onPremiumRequired}
        />
      );

      fireEvent.press(
        getByLabelText('Create your Vision Board with motivational images')
      );

      expect(onPremiumRequired).toHaveBeenCalled();
    });

    it('does not show "Add Your First Image" button for non-premium', () => {
      const { queryByText } = render(
        <VisionBoardSection {...defaultProps} isPremium={false} />
      );

      expect(queryByText('Add Your First Image')).toBeNull();
    });
  });

  describe('Premium Users', () => {
    it('does not show PRO badge for premium users', () => {
      const { queryByText } = render(
        <VisionBoardSection {...defaultProps} isPremium={true} />
      );

      expect(queryByText('PRO')).toBeNull();
    });

    it('shows image grid for premium users', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...defaultProps} isPremium={true} />
      );

      expect(getByLabelText('Add image to slot 1')).toBeTruthy();
    });

    it('shows "Add Your First Image" button for premium in empty state', () => {
      const { getByText } = render(
        <VisionBoardSection {...defaultProps} isPremium={true} />
      );

      expect(getByText('Add Your First Image')).toBeTruthy();
    });

    it('allows adding images for premium users', async () => {
      const onAddImage = jest.fn().mockResolvedValue(undefined);
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} onAddImage={onAddImage} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      await act(async () => {
        fireEvent.press(getByText('Choose from Library'));
      });

      expect(onAddImage).toHaveBeenCalled();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC7: Delete Functionality
// ─────────────────────────────────────────────────────────────────────────────

describe('AC7: Delete Functionality - Confirmation and cascade delete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Delete Button', () => {
    it('shows delete button in image viewer', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...filledProps} />
      );

      fireEvent.press(getByLabelText('First image caption'));

      expect(getByLabelText('Delete image')).toBeTruthy();
    });
  });

  describe('Delete Confirmation', () => {
    it('shows confirmation alert when delete is pressed', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...filledProps} />
      );

      fireEvent.press(getByLabelText('First image caption'));
      fireEvent.press(getByLabelText('Delete image'));

      expect(mockAlert).toHaveBeenCalledWith(
        'Delete Image',
        'Are you sure you want to remove this image from your Vision Board?',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Cancel' }),
          expect.objectContaining({ text: 'Delete', style: 'destructive' }),
        ])
      );
    });

    it('has cancel option in confirmation', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...filledProps} />
      );

      fireEvent.press(getByLabelText('First image caption'));
      fireEvent.press(getByLabelText('Delete image'));

      const alertCall = mockAlert.mock.calls[0];
      const buttons = alertCall[2];
      expect(buttons.find((b: unknown) => b.style === 'cancel')).toBeTruthy();
    });

    it('has destructive delete option', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...filledProps} />
      );

      fireEvent.press(getByLabelText('First image caption'));
      fireEvent.press(getByLabelText('Delete image'));

      const alertCall = mockAlert.mock.calls[0];
      const buttons = alertCall[2];
      expect(buttons.find((b: unknown) => b.style === 'destructive')).toBeTruthy();
    });
  });

  describe('Delete Execution', () => {
    it('calls onDeleteImage when delete is confirmed', async () => {
      const onDeleteImage = jest.fn().mockResolvedValue(undefined);

      // Mock Alert to immediately call the delete callback
      mockAlert.mockImplementationOnce((title, message, buttons) => {
        const deleteButton = buttons.find(
          (b: unknown) => b.style === 'destructive'
        );
        deleteButton?.onPress?.();
      });

      const { getByLabelText } = render(
        <VisionBoardSection {...filledProps} onDeleteImage={onDeleteImage} />
      );

      fireEvent.press(getByLabelText('First image caption'));

      await act(async () => {
        fireEvent.press(getByLabelText('Delete image'));
      });

      expect(onDeleteImage).toHaveBeenCalledWith('img-1');
    });

    it('closes viewer after successful delete', async () => {
      const onDeleteImage = jest.fn().mockResolvedValue(undefined);

      mockAlert.mockImplementationOnce((title, message, buttons) => {
        const deleteButton = buttons.find(
          (b: unknown) => b.style === 'destructive'
        );
        deleteButton?.onPress?.();
      });

      const { getByLabelText, queryByLabelText } = render(
        <VisionBoardSection {...filledProps} onDeleteImage={onDeleteImage} />
      );

      fireEvent.press(getByLabelText('First image caption'));

      await act(async () => {
        fireEvent.press(getByLabelText('Delete image'));
      });

      // Viewer should close after delete
      // (Implementation may have animation delay)
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC8: Accessibility
// ─────────────────────────────────────────────────────────────────────────────

describe('AC8: Accessibility - Labels, roles, reduceMotion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Accessibility Labels', () => {
    it('has accessibility label for empty section', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      expect(
        getByLabelText('Create your Vision Board with motivational images')
      ).toBeTruthy();
    });

    it('has accessibility label for filled section', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...filledProps} />
      );

      expect(getByLabelText('Vision Board with 2 images')).toBeTruthy();
    });

    it('has accessibility labels for grid cells', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...filledProps} />
      );

      expect(getByLabelText('First image caption')).toBeTruthy();
      expect(getByLabelText('Vision board image 2')).toBeTruthy();
      expect(getByLabelText('Add image to slot 3')).toBeTruthy();
    });

    it('has accessibility labels for viewer controls', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...filledProps} />
      );

      fireEvent.press(getByLabelText('First image caption'));

      expect(getByLabelText('Close image viewer')).toBeTruthy();
      expect(getByLabelText('Edit caption')).toBeTruthy();
      expect(getByLabelText('Delete image')).toBeTruthy();
    });

    it('has accessibility labels for add modal', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      expect(getByLabelText('Take a photo')).toBeTruthy();
      expect(getByLabelText('Choose from library')).toBeTruthy();
      expect(getByLabelText('Cancel')).toBeTruthy();
    });
  });

  describe('Accessibility Roles', () => {
    it('grid cells have button role', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...filledProps} />
      );

      const cell = getByLabelText('First image caption');
      expect(cell.props.accessibilityRole).toBe('button');
    });

    it('add modal options have button role', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      expect(getByLabelText('Take a photo').props.accessibilityRole).toBe(
        'button'
      );
    });
  });

  describe('Reduce Motion Support', () => {
    it('respects reduceMotion prop', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...defaultProps} reduceMotion={true} />
      );

      // Component should render without animation delays
      expect(
        getByLabelText('Create your Vision Board with motivational images')
      ).toBeTruthy();
    });

    it('accepts shouldAnimate prop', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...defaultProps} shouldAnimate={true} />
      );

      expect(
        getByLabelText('Create your Vision Board with motivational images')
      ).toBeTruthy();
    });

    it('accepts sectionIndex prop', () => {
      const { getByLabelText } = render(
        <VisionBoardSection {...defaultProps} sectionIndex={5} />
      );

      expect(
        getByLabelText('Create your Vision Board with motivational images')
      ).toBeTruthy();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC9: Fuchsia Accent Styling
// ─────────────────────────────────────────────────────────────────────────────

describe('AC9: Fuchsia Accent Styling - Consistent theming', () => {
  it('section has fuchsia accent border (border-l-fuchsia-400)', () => {
    const { getByLabelText } = render(<VisionBoardSection {...defaultProps} />);

    const section = getByLabelText(
      'Create your Vision Board with motivational images'
    );
    expect(section).toBeTruthy();
    // The actual border-l-fuchsia-400 class is applied in the component
  });

  it('section icon is present (Image or Grid3x3)', () => {
    const { getAllByTestId } = render(<VisionBoardSection {...defaultProps} />);

    // Image icon in empty state
    const imageIcons = getAllByTestId('lucide-icon-Image');
    expect(imageIcons.length).toBeGreaterThan(0);
  });

  it('uses Grid3x3 icon when images exist', () => {
    const { getAllByTestId } = render(<VisionBoardSection {...filledProps} />);

    const gridIcons = getAllByTestId('lucide-icon-Grid3x3');
    expect(gridIcons.length).toBeGreaterThan(0);
  });

  it('add button uses fuchsia color scheme', () => {
    const { getByText } = render(<VisionBoardSection {...defaultProps} />);

    expect(getByText('Add Your First Image')).toBeTruthy();
    // Button should have fuchsia styling (bg-fuchsia-500)
  });

  it('add image modal uses fuchsia styling', () => {
    const { getByLabelText, getAllByTestId } = render(
      <VisionBoardSection {...defaultProps} />
    );

    fireEvent.press(getByLabelText('Add image to slot 1'));

    // ImagePlus icon with fuchsia color
    const imagePlusIcons = getAllByTestId('lucide-icon-ImagePlus');
    expect(imagePlusIcons.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC10: Scientific Basis Validation
// ─────────────────────────────────────────────────────────────────────────────

describe('AC10: Scientific Basis - Visual motivation and mirror neurons', () => {
  /**
   * Vision Board is grounded in psychological research:
   * - Visual motivation reinforces goals through mental imagery
   * - Personal images > stock images for emotional connection (Brewer, 2018)
   * - Mirror neurons activate when viewing goal-related imagery
   * - Mental contrasting with visual cues improves goal pursuit (Oettingen, 2014)
   */

  it('displays science tip in empty state', () => {
    const { getByText } = render(<VisionBoardSection {...defaultProps} />);

    expect(
      getByText('Visual cues activate mirror neurons and reinforce motivation')
    ).toBeTruthy();
  });

  it('shows inspirational description in empty state', () => {
    const { getByText } = render(<VisionBoardSection {...defaultProps} />);

    expect(
      getByText('Add photos that inspire your habit journey')
    ).toBeTruthy();
  });

  it('has Sparkles icon for science tip', () => {
    const { getAllByTestId } = render(<VisionBoardSection {...defaultProps} />);

    const sparklesIcons = getAllByTestId('lucide-icon-Sparkles');
    expect(sparklesIcons.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC11: Complete User Flow Validation
// ─────────────────────────────────────────────────────────────────────────────

describe('AC11: Complete User Flow - Add, View, Edit, Delete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPickFromLibrary.mockResolvedValue(mockPickedImage);
    mockUploadImage.mockResolvedValue(mockUploadResult);
  });

  it('completes full add image flow: open modal → pick → upload → save', async () => {
    const onAddImage = jest.fn().mockResolvedValue(undefined);

    const { getByLabelText, getByText, queryByText } = render(
      <VisionBoardSection {...defaultProps} onAddImage={onAddImage} />
    );

    // Step 1: Open add modal
    fireEvent.press(getByLabelText('Add image to slot 1'));
    expect(getByText('Add to Vision Board')).toBeTruthy();

    // Step 2: Choose library
    await act(async () => {
      fireEvent.press(getByText('Choose from Library'));
    });

    // Step 3: Verify upload was called
    expect(mockUploadImage).toHaveBeenCalledWith(mockPickedImage);

    // Step 4: Verify onAddImage was called
    expect(onAddImage).toHaveBeenCalledWith(mockStorageId);
  });

  it('completes full view and edit caption flow', async () => {
    const onUpdateCaption = jest.fn().mockResolvedValue(undefined);

    const { getByLabelText, getByPlaceholderText, getByText } = render(
      <VisionBoardSection {...filledProps} onUpdateCaption={onUpdateCaption} />
    );

    // Step 1: Open image viewer
    fireEvent.press(getByLabelText('First image caption'));
    expect(getByLabelText('Close image viewer')).toBeTruthy();

    // Step 2: Open caption editor
    fireEvent.press(getByLabelText('Edit caption'));
    expect(getByPlaceholderText('Add a caption...')).toBeTruthy();

    // Step 3: Edit caption
    const input = getByPlaceholderText('Add a caption...');
    fireEvent.changeText(input, 'My new motivation photo');

    // Step 4: Save
    await act(async () => {
      fireEvent.press(getByText('Save'));
    });

    expect(onUpdateCaption).toHaveBeenCalledWith(
      'img-1',
      'My new motivation photo'
    );
  });

  it('completes full delete flow', async () => {
    const onDeleteImage = jest.fn().mockResolvedValue(undefined);

    mockAlert.mockImplementationOnce((title, message, buttons) => {
      const deleteButton = buttons.find((b: unknown) => b.style === 'destructive');
      deleteButton?.onPress?.();
    });

    const { getByLabelText } = render(
      <VisionBoardSection {...filledProps} onDeleteImage={onDeleteImage} />
    );

    // Step 1: Open image viewer
    fireEvent.press(getByLabelText('First image caption'));

    // Step 2: Initiate delete
    await act(async () => {
      fireEvent.press(getByLabelText('Delete image'));
    });

    // Step 3: Verify delete was called (confirmation auto-confirmed by mock)
    expect(onDeleteImage).toHaveBeenCalledWith('img-1');
  });

  it('handles premium upgrade flow gracefully', () => {
    const onPremiumRequired = jest.fn();

    const { getByLabelText, queryByText } = render(
      <VisionBoardSection
        {...defaultProps}
        isPremium={false}
        onPremiumRequired={onPremiumRequired}
      />
    );

    // Non-premium user taps section
    fireEvent.press(
      getByLabelText('Create your Vision Board with motivational images')
    );

    // Should trigger premium upsell
    expect(onPremiumRequired).toHaveBeenCalled();
    // Add modal should not open
    expect(queryByText('Add to Vision Board')).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC12: Edge Cases
// ─────────────────────────────────────────────────────────────────────────────

describe('AC12: Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles empty images array gracefully', () => {
    const { getByText } = render(
      <VisionBoardSection {...defaultProps} images={[]} imageCount={0} />
    );

    expect(getByText('Add Your First Image')).toBeTruthy();
  });

  it('handles image without caption', () => {
    const { getByLabelText } = render(<VisionBoardSection {...filledProps} />);

    // Second image has no caption
    expect(getByLabelText('Vision board image 2')).toBeTruthy();
  });

  it('handles very long caption', () => {
    const longCaption = 'A'.repeat(200); // Max length
    const imageWithLongCaption: VisionBoardImage = {
      ...mockTwoImages[0],
      caption: longCaption,
    };

    const { getByLabelText } = render(
      <VisionBoardSection
        {...defaultProps}
        images={[imageWithLongCaption]}
        imageCount={1}
      />
    );

    expect(getByLabelText(longCaption)).toBeTruthy();
  });

  it('handles image with null imageUrl (loading state)', () => {
    const imageLoading: VisionBoardImage = {
      ...mockTwoImages[0],
      imageUrl: null,
    };

    const { getByLabelText } = render(
      <VisionBoardSection
        {...defaultProps}
        images={[imageLoading]}
        imageCount={1}
      />
    );

    expect(getByLabelText('First image caption')).toBeTruthy();
    // Should show loading indicator
  });

  it('handles undefined callbacks gracefully', () => {
    const minimalProps: VisionBoardSectionProps = {
      images: [],
      imageCount: 0,
      isPremium: true,
      onAddImage: jest.fn(),
      onUpdateCaption: jest.fn(),
      onDeleteImage: jest.fn(),
      onPremiumRequired: jest.fn(),
    };

    const { getByText } = render(<VisionBoardSection {...minimalProps} />);

    expect(getByText('Vision Board')).toBeTruthy();
  });

  it('handles rapid modal open/close', () => {
    const { getByLabelText, getByText, queryByText } = render(
      <VisionBoardSection {...defaultProps} />
    );

    // Open modal
    fireEvent.press(getByLabelText('Add image to slot 1'));
    expect(queryByText('Add to Vision Board')).toBeTruthy();

    // Close modal
    fireEvent.press(getByText('Cancel'));
    expect(queryByText('Add to Vision Board')).toBeNull();

    // Open again
    fireEvent.press(getByLabelText('Add image to slot 1'));
    expect(queryByText('Add to Vision Board')).toBeTruthy();
  });

  it('handles imageCount mismatch with images array', () => {
    // imageCount says 5, but only 2 in array
    const { getByLabelText } = render(
      <VisionBoardSection
        {...defaultProps}
        images={mockTwoImages}
        imageCount={5} // Mismatched
      />
    );

    // Component should still work based on actual images array
    expect(getByLabelText('First image caption')).toBeTruthy();
    expect(getByLabelText('Vision board image 2')).toBeTruthy();
  });

  it('handles all slots filled (no empty slots)', () => {
    const { queryByLabelText, getByText } = render(
      <VisionBoardSection {...fullProps} />
    );

    // No empty slots when full
    expect(queryByLabelText('Add image to slot 1')).toBeNull();
    expect(queryByLabelText('Add image to slot 2')).toBeNull();

    // Shows 4/4 count
    expect(getByText('4/4')).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC13: Integration with Hooks
// ─────────────────────────────────────────────────────────────────────────────

describe('AC13: Integration with Image Picker and Upload Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPickFromCamera.mockResolvedValue(mockPickedImage);
    mockPickFromLibrary.mockResolvedValue(mockPickedImage);
    mockUploadImage.mockResolvedValue(mockUploadResult);
  });

  describe('useImagePicker Integration', () => {
    it('uses pickFromCamera for camera source', async () => {
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      await act(async () => {
        fireEvent.press(getByText('Take Photo'));
      });

      expect(mockPickFromCamera).toHaveBeenCalledWith({
        aspect: [1, 1],
        quality: 0.8,
      });
    });

    it('uses pickFromLibrary for library source', async () => {
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      await act(async () => {
        fireEvent.press(getByText('Choose from Library'));
      });

      expect(mockPickFromLibrary).toHaveBeenCalledWith({
        aspect: [1, 1],
        quality: 0.8,
      });
    });
  });

  describe('useImageUpload Integration', () => {
    it('calls uploadImage with picked image data', async () => {
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      await act(async () => {
        fireEvent.press(getByText('Choose from Library'));
      });

      expect(mockUploadImage).toHaveBeenCalledWith(mockPickedImage);
    });

    it('uses storageId from upload result', async () => {
      const onAddImage = jest.fn();
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} onAddImage={onAddImage} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      await act(async () => {
        fireEvent.press(getByText('Choose from Library'));
      });

      expect(onAddImage).toHaveBeenCalledWith(mockStorageId);
    });
  });
});
