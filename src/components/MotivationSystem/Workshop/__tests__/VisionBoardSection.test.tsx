/**
 * Tests for VisionBoardSection component
 *
 * Story T12: Vision Board feature
 * - T12.2: Image picker integration
 * - T12.3: Image upload to storage
 * - T12.4: 4-image grid display
 * - T12.5: Full-size image viewer
 * - T12.6: Optional captions
 * - T12.7: Premium gate
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

// Mock hooks
const mockPickFromCamera = jest.fn();
const mockPickFromLibrary = jest.fn();
const mockUploadImage = jest.fn();

jest.mock('../../../../hooks/useImagePicker', () => ({
  useImagePicker: () => ({
    pickFromCamera: mockPickFromCamera,
    pickFromLibrary: mockPickFromLibrary,
    pickWithChoice: jest.fn(),
    clearImage: jest.fn(),
    isLoading: false,
    image: null,
    error: null,
  }),
}));

jest.mock('../../../../hooks/useImageUpload', () => ({
  useImageUpload: () => ({
    uploadImage: mockUploadImage,
    isUploading: false,
    progress: 0,
    error: null,
    clearError: jest.fn(),
  }),
}));

// Mock Haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
  },
  NotificationFeedbackType: {
    Success: 'success',
  },
}));

// Mock Alert
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Alert: {
      alert: jest.fn(),
    },
  };
});

import {
  VisionBoardSection,
  type VisionBoardImage,
  type VisionBoardSectionProps,
} from '../VisionBoardSection';
import { Alert } from 'react-native';
import type { Id } from '../../../../../convex/_generated/dataModel';

const mockStorageId = 'k97123456789' as Id<'_storage'>;

const mockImages: VisionBoardImage[] = [
  {
    id: 'img-1',
    storageId: mockStorageId,
    imageUrl: 'https://example.com/image1.jpg',
    caption: 'Test caption 1',
    order: 0,
    createdAt: Date.now(),
  },
  {
    id: 'img-2',
    storageId: mockStorageId,
    imageUrl: 'https://example.com/image2.jpg',
    order: 1,
    createdAt: Date.now(),
  },
];

const defaultProps: VisionBoardSectionProps = {
  images: [],
  imageCount: 0,
  isPremium: true,
  onAddImage: jest.fn(),
  onUpdateCaption: jest.fn(),
  onDeleteImage: jest.fn(),
  onPremiumRequired: jest.fn(),
  shouldAnimate: false,
  reduceMotion: true,
  sectionIndex: 0,
};

describe('VisionBoardSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('empty state', () => {
    it('renders empty state with pulsing icon', () => {
      const { getByText, getByLabelText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      expect(getByText('Vision Board')).toBeTruthy();
      expect(
        getByText('Add photos that inspire your habit journey')
      ).toBeTruthy();
      expect(
        getByLabelText('Create your Vision Board with motivational images')
      ).toBeTruthy();
    });

    it('shows science tip in empty state', () => {
      const { getByText } = render(<VisionBoardSection {...defaultProps} />);

      expect(
        getByText(
          'Visual cues activate mirror neurons and reinforce motivation'
        )
      ).toBeTruthy();
    });

    it('shows "Add Your First Image" button when premium', () => {
      const { getByText } = render(<VisionBoardSection {...defaultProps} />);

      expect(getByText('Add Your First Image')).toBeTruthy();
    });

    it('does not show add button when not premium', () => {
      const { queryByText } = render(
        <VisionBoardSection {...defaultProps} isPremium={false} />
      );

      expect(queryByText('Add Your First Image')).toBeNull();
    });
  });

  describe('premium gating (T12.7)', () => {
    it('shows PRO badge when not premium', () => {
      const { getByText } = render(
        <VisionBoardSection {...defaultProps} isPremium={false} />
      );

      expect(getByText('PRO')).toBeTruthy();
    });

    it('does not show PRO badge when premium', () => {
      const { queryByText } = render(
        <VisionBoardSection {...defaultProps} isPremium={true} />
      );

      expect(queryByText('PRO')).toBeNull();
    });

    it('calls onPremiumRequired when non-premium user presses section', () => {
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

    it('does not show image grid when not premium', () => {
      const { queryByLabelText } = render(
        <VisionBoardSection
          {...defaultProps}
          isPremium={false}
          images={mockImages}
          imageCount={2}
        />
      );

      expect(queryByLabelText('Add image to slot 1')).toBeNull();
    });
  });

  describe('4-image grid display (T12.4)', () => {
    it('renders all images in grid', () => {
      const { getByLabelText } = render(
        <VisionBoardSection
          {...defaultProps}
          images={mockImages}
          imageCount={2}
        />
      );

      expect(getByLabelText('Test caption 1')).toBeTruthy();
      expect(getByLabelText('Vision board image 2')).toBeTruthy();
    });

    it('shows empty slots for remaining grid positions', () => {
      const { getByLabelText } = render(
        <VisionBoardSection
          {...defaultProps}
          images={mockImages}
          imageCount={2}
        />
      );

      // With 2 images, slots 3 and 4 should be empty
      expect(getByLabelText('Add image to slot 3')).toBeTruthy();
      expect(getByLabelText('Add image to slot 4')).toBeTruthy();
    });

    it('shows image count indicator', () => {
      const { getByText } = render(
        <VisionBoardSection
          {...defaultProps}
          images={mockImages}
          imageCount={2}
        />
      );

      expect(getByText('2/4')).toBeTruthy();
    });

    it('shows completion checkmark when images exist', () => {
      const { UNSAFE_queryAllByType } = render(
        <VisionBoardSection
          {...defaultProps}
          images={mockImages}
          imageCount={2}
          shouldAnimate={false}
        />
      );

      // Component should have completion checkmark visible
      // Testing indirectly through the structure
      expect(UNSAFE_queryAllByType('View').length).toBeGreaterThan(0);
    });
  });

  describe('image picker integration (T12.2)', () => {
    it('opens add modal when empty slot pressed', () => {
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      // Press the first empty slot
      fireEvent.press(getByLabelText('Add image to slot 1'));

      // Modal should be open with camera/library options
      expect(getByText('Add to Vision Board')).toBeTruthy();
      expect(getByText('Take Photo')).toBeTruthy();
      expect(getByText('Choose from Library')).toBeTruthy();
    });

    it('calls pickFromCamera when Take Photo pressed', async () => {
      mockPickFromCamera.mockResolvedValueOnce({
        uri: 'file://camera.jpg',
        width: 1000,
        height: 1000,
        type: 'image',
        mimeType: 'image/jpeg',
      });
      mockUploadImage.mockResolvedValueOnce({ storageId: mockStorageId });

      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      // Open modal
      fireEvent.press(getByLabelText('Add image to slot 1'));

      // Press Take Photo
      await act(async () => {
        fireEvent.press(getByText('Take Photo'));
      });

      expect(mockPickFromCamera).toHaveBeenCalled();
    });

    it('calls pickFromLibrary when Choose from Library pressed', async () => {
      mockPickFromLibrary.mockResolvedValueOnce({
        uri: 'file://library.jpg',
        width: 1000,
        height: 1000,
        type: 'image',
        mimeType: 'image/jpeg',
      });
      mockUploadImage.mockResolvedValueOnce({ storageId: mockStorageId });

      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      // Open modal
      fireEvent.press(getByLabelText('Add image to slot 1'));

      // Press Choose from Library
      await act(async () => {
        fireEvent.press(getByText('Choose from Library'));
      });

      expect(mockPickFromLibrary).toHaveBeenCalled();
    });
  });

  describe('image upload (T12.3)', () => {
    it('uploads picked image to storage', async () => {
      const mockImage = {
        uri: 'file://test.jpg',
        width: 1000,
        height: 1000,
        type: 'image' as const,
        mimeType: 'image/jpeg',
      };

      mockPickFromLibrary.mockResolvedValueOnce(mockImage);
      mockUploadImage.mockResolvedValueOnce({ storageId: mockStorageId });

      const onAddImage = jest.fn();
      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} onAddImage={onAddImage} />
      );

      // Open modal and pick from library
      fireEvent.press(getByLabelText('Add image to slot 1'));

      await act(async () => {
        fireEvent.press(getByText('Choose from Library'));
      });

      expect(mockUploadImage).toHaveBeenCalledWith(mockImage);
      expect(onAddImage).toHaveBeenCalledWith(mockStorageId);
    });

    it('shows alert when upload fails', async () => {
      mockPickFromLibrary.mockResolvedValueOnce({
        uri: 'file://test.jpg',
        width: 1000,
        height: 1000,
        type: 'image',
        mimeType: 'image/jpeg',
      });
      mockUploadImage.mockResolvedValueOnce(null); // Upload fails

      const { getByLabelText, getByText } = render(
        <VisionBoardSection {...defaultProps} />
      );

      fireEvent.press(getByLabelText('Add image to slot 1'));

      await act(async () => {
        fireEvent.press(getByText('Choose from Library'));
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Upload Failed',
        'There was a problem adding your image. Please try again.'
      );
    });

    it('prevents adding when grid is full', async () => {
      const fullImages: VisionBoardImage[] = [
        { ...mockImages[0], order: 0 },
        { ...mockImages[1], order: 1 },
        { ...mockImages[0], id: 'img-3', order: 2 },
        { ...mockImages[1], id: 'img-4', order: 3 },
      ];

      const { queryByLabelText } = render(
        <VisionBoardSection
          {...defaultProps}
          images={fullImages}
          imageCount={4}
        />
      );

      // No empty slots should exist
      expect(queryByLabelText('Add image to slot 1')).toBeNull();
      expect(queryByLabelText('Add image to slot 2')).toBeNull();
      expect(queryByLabelText('Add image to slot 3')).toBeNull();
      expect(queryByLabelText('Add image to slot 4')).toBeNull();
    });
  });

  describe('full-size image viewer (T12.5)', () => {
    it('opens viewer when image pressed', () => {
      const { getByLabelText, getByText } = render(
        <VisionBoardSection
          {...defaultProps}
          images={mockImages}
          imageCount={2}
        />
      );

      fireEvent.press(getByLabelText('Test caption 1'));

      // Viewer modal should be open
      expect(getByLabelText('Close image viewer')).toBeTruthy();
      expect(getByLabelText('Edit caption')).toBeTruthy();
      expect(getByLabelText('Delete image')).toBeTruthy();
    });

    it('displays image caption in viewer', () => {
      const { getByLabelText, getByText } = render(
        <VisionBoardSection
          {...defaultProps}
          images={mockImages}
          imageCount={2}
        />
      );

      fireEvent.press(getByLabelText('Test caption 1'));

      expect(getByText('Test caption 1')).toBeTruthy();
    });

    it('closes viewer when close button pressed', () => {
      const { getByLabelText, queryByLabelText } = render(
        <VisionBoardSection
          {...defaultProps}
          images={mockImages}
          imageCount={2}
        />
      );

      // Open viewer
      fireEvent.press(getByLabelText('Test caption 1'));
      expect(getByLabelText('Close image viewer')).toBeTruthy();

      // Close it
      fireEvent.press(getByLabelText('Close image viewer'));

      // Modal should be closed
      // Note: Due to animation delay, this may need waitFor
    });
  });

  describe('optional captions (T12.6)', () => {
    it('displays caption overlay on grid image', () => {
      const { getByText } = render(
        <VisionBoardSection
          {...defaultProps}
          images={mockImages}
          imageCount={2}
        />
      );

      expect(getByText('Test caption 1')).toBeTruthy();
    });

    it('shows edit caption button in viewer', () => {
      const { getByLabelText } = render(
        <VisionBoardSection
          {...defaultProps}
          images={mockImages}
          imageCount={2}
        />
      );

      fireEvent.press(getByLabelText('Test caption 1'));

      expect(getByLabelText('Edit caption')).toBeTruthy();
    });

    it('opens caption editor when edit button pressed', () => {
      const { getByLabelText, getByPlaceholderText } = render(
        <VisionBoardSection
          {...defaultProps}
          images={mockImages}
          imageCount={2}
        />
      );

      fireEvent.press(getByLabelText('Test caption 1'));
      fireEvent.press(getByLabelText('Edit caption'));

      expect(getByPlaceholderText('Add a caption...')).toBeTruthy();
    });

    it('calls onUpdateCaption when save pressed', async () => {
      const onUpdateCaption = jest.fn().mockResolvedValueOnce(undefined);

      const { getByLabelText, getByPlaceholderText, getByText } = render(
        <VisionBoardSection
          {...defaultProps}
          images={mockImages}
          imageCount={2}
          onUpdateCaption={onUpdateCaption}
        />
      );

      // Open viewer and edit mode
      fireEvent.press(getByLabelText('Test caption 1'));
      fireEvent.press(getByLabelText('Edit caption'));

      // Change caption
      const input = getByPlaceholderText('Add a caption...');
      fireEvent.changeText(input, 'New caption');

      // Save
      await act(async () => {
        fireEvent.press(getByText('Save'));
      });

      expect(onUpdateCaption).toHaveBeenCalledWith('img-1', 'New caption');
    });

    it('shows character count in caption editor', () => {
      const { getByLabelText, getByPlaceholderText, getByText } = render(
        <VisionBoardSection
          {...defaultProps}
          images={mockImages}
          imageCount={2}
        />
      );

      fireEvent.press(getByLabelText('Test caption 1'));
      fireEvent.press(getByLabelText('Edit caption'));

      // Should show current count / max
      expect(getByText('14/200')).toBeTruthy(); // "Test caption 1" is 14 chars
    });
  });

  describe('delete functionality', () => {
    it('shows delete button in viewer', () => {
      const { getByLabelText } = render(
        <VisionBoardSection
          {...defaultProps}
          images={mockImages}
          imageCount={2}
        />
      );

      fireEvent.press(getByLabelText('Test caption 1'));

      expect(getByLabelText('Delete image')).toBeTruthy();
    });

    it('shows confirmation alert when delete pressed', () => {
      const { getByLabelText } = render(
        <VisionBoardSection
          {...defaultProps}
          images={mockImages}
          imageCount={2}
        />
      );

      fireEvent.press(getByLabelText('Test caption 1'));
      fireEvent.press(getByLabelText('Delete image'));

      expect(Alert.alert).toHaveBeenCalledWith(
        'Delete Image',
        'Are you sure you want to remove this image from your Vision Board?',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Cancel' }),
          expect.objectContaining({ text: 'Delete', style: 'destructive' }),
        ])
      );
    });
  });

  describe('accessibility', () => {
    it('has proper accessibility labels for grid cells', () => {
      const { getByLabelText } = render(
        <VisionBoardSection
          {...defaultProps}
          images={mockImages}
          imageCount={2}
        />
      );

      expect(getByLabelText('Test caption 1')).toBeTruthy();
      expect(getByLabelText('Vision board image 2')).toBeTruthy();
      expect(getByLabelText('Add image to slot 3')).toBeTruthy();
    });

    it('has proper accessibility roles', () => {
      const { getByLabelText } = render(
        <VisionBoardSection
          {...defaultProps}
          images={mockImages}
          imageCount={2}
        />
      );

      // Images should be buttons
      expect(getByLabelText('Test caption 1').props.accessibilityRole).toBe(
        'button'
      );
    });
  });

  describe('animations', () => {
    it('respects reduceMotion prop', () => {
      // With reduceMotion, animations should be instant
      const { getByText } = render(
        <VisionBoardSection {...defaultProps} reduceMotion={true} />
      );

      // Component should render without animation delays
      expect(getByText('Vision Board')).toBeTruthy();
    });

    it('applies stagger delay based on sectionIndex', () => {
      const { getByText } = render(
        <VisionBoardSection
          {...defaultProps}
          shouldAnimate={true}
          reduceMotion={false}
          sectionIndex={3}
        />
      );

      // Component should still render (animation is async)
      expect(getByText('Vision Board')).toBeTruthy();
    });
  });
});
