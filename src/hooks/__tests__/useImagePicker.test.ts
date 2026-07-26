/**
 * Tests for useImagePicker hook
 *
 * Story T12.2: Image picker integration for Vision Board
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';

// Mock expo-image-picker
const mockLaunchImageLibraryAsync = jest.fn();
const mockLaunchCameraAsync = jest.fn();
const mockRequestMediaLibraryPermissionsAsync = jest.fn();
const mockRequestCameraPermissionsAsync = jest.fn();

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: (options: unknown) =>
    mockLaunchImageLibraryAsync(options),
  launchCameraAsync: (options: unknown) => mockLaunchCameraAsync(options),
  requestMediaLibraryPermissionsAsync: () =>
    mockRequestMediaLibraryPermissionsAsync(),
  requestCameraPermissionsAsync: () => mockRequestCameraPermissionsAsync(),
  MediaTypeOptions: {
    Images: 'Images',
  },
  PermissionStatus: {
    DENIED: 'denied',
    GRANTED: 'granted',
    UNDETERMINED: 'undetermined',
  },
}));

// Mock react-native
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
  Linking: {
    openURL: jest.fn(),
    openSettings: jest.fn(),
  },
  Platform: {
    OS: 'ios',
  },
}));

import { useImagePicker } from '../useImagePicker';
import { Alert } from 'react-native';

describe('useImagePicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('returns null image initially', () => {
      const { result } = renderHook(() => useImagePicker());
      expect(result.current.image).toBeNull();
    });

    it('is not loading initially', () => {
      const { result } = renderHook(() => useImagePicker());
      expect(result.current.isLoading).toBe(false);
    });

    it('has no error initially', () => {
      const { result } = renderHook(() => useImagePicker());
      expect(result.current.error).toBeNull();
    });

    it('has null permissions initially', () => {
      const { result } = renderHook(() => useImagePicker());
      expect(result.current.hasCameraPermission).toBeNull();
      expect(result.current.hasLibraryPermission).toBeNull();
    });
  });

  describe('pickFromLibrary', () => {
    it('requests permissions before picking', async () => {
      mockRequestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: 'granted',
      });
      mockLaunchImageLibraryAsync.mockResolvedValueOnce({
        canceled: true,
        assets: [],
      });

      const { result } = renderHook(() => useImagePicker());

      await act(async () => {
        await result.current.pickFromLibrary();
      });

      expect(mockRequestMediaLibraryPermissionsAsync).toHaveBeenCalled();
    });

    it('returns null when permission denied', async () => {
      mockRequestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: 'denied',
      });

      const { result } = renderHook(() => useImagePicker());

      let pickedImage: unknown;
      await act(async () => {
        pickedImage = await result.current.pickFromLibrary();
      });

      expect(pickedImage).toBeNull();
      expect(result.current.hasLibraryPermission).toBe(false);
      expect(Alert.alert).toHaveBeenCalled();
    });

    it('returns null when user cancels picker', async () => {
      mockRequestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: 'granted',
      });
      mockLaunchImageLibraryAsync.mockResolvedValueOnce({
        canceled: true,
        assets: [],
      });

      const { result } = renderHook(() => useImagePicker());

      let pickedImage: unknown;
      await act(async () => {
        pickedImage = await result.current.pickFromLibrary();
      });

      expect(pickedImage).toBeNull();
      expect(result.current.image).toBeNull();
    });

    it('returns picked image on success', async () => {
      const mockAsset = {
        uri: 'file://test.jpg',
        width: 1000,
        height: 1000,
        mimeType: 'image/jpeg',
        fileSize: 12345,
      };

      mockRequestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: 'granted',
      });
      mockLaunchImageLibraryAsync.mockResolvedValueOnce({
        canceled: false,
        assets: [mockAsset],
      });

      const { result } = renderHook(() => useImagePicker());

      let pickedImage: unknown;
      await act(async () => {
        pickedImage = await result.current.pickFromLibrary();
      });

      expect(pickedImage).toEqual({
        uri: 'file://test.jpg',
        width: 1000,
        height: 1000,
        type: 'image',
        mimeType: 'image/jpeg',
        fileSize: 12345,
      });
      expect(result.current.image).toEqual(pickedImage);
    });

    it('sets loading state during picking', async () => {
      let resolvePermission: (value: { status: string }) => void;
      const permissionPromise = new Promise<{ status: string }>((resolve) => {
        resolvePermission = resolve;
      });

      mockRequestMediaLibraryPermissionsAsync.mockReturnValueOnce(
        permissionPromise
      );

      const { result } = renderHook(() => useImagePicker());

      // Start picking (don't await)
      let pickPromise: Promise<unknown>;
      act(() => {
        pickPromise = result.current.pickFromLibrary();
      });

      // Should be loading now
      expect(result.current.isLoading).toBe(true);

      // Complete the flow
      mockLaunchImageLibraryAsync.mockResolvedValueOnce({
        canceled: true,
        assets: [],
      });

      await act(async () => {
        resolvePermission!({ status: 'granted' });
        await pickPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('uses default options when none provided', async () => {
      mockRequestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: 'granted',
      });
      mockLaunchImageLibraryAsync.mockResolvedValueOnce({
        canceled: true,
        assets: [],
      });

      const { result } = renderHook(() => useImagePicker());

      await act(async () => {
        await result.current.pickFromLibrary();
      });

      expect(mockLaunchImageLibraryAsync).toHaveBeenCalledWith({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });
    });

    it('merges custom options with defaults', async () => {
      mockRequestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: 'granted',
      });
      mockLaunchImageLibraryAsync.mockResolvedValueOnce({
        canceled: true,
        assets: [],
      });

      const { result } = renderHook(() => useImagePicker());

      await act(async () => {
        await result.current.pickFromLibrary({ aspect: [4, 3], quality: 1 });
      });

      expect(mockLaunchImageLibraryAsync).toHaveBeenCalledWith({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: false,
      });
    });
  });

  describe('pickFromCamera', () => {
    it('requests camera permissions before capturing', async () => {
      mockRequestCameraPermissionsAsync.mockResolvedValueOnce({
        status: 'granted',
      });
      mockLaunchCameraAsync.mockResolvedValueOnce({
        canceled: true,
        assets: [],
      });

      const { result } = renderHook(() => useImagePicker());

      await act(async () => {
        await result.current.pickFromCamera();
      });

      expect(mockRequestCameraPermissionsAsync).toHaveBeenCalled();
    });

    it('returns null when camera permission denied', async () => {
      mockRequestCameraPermissionsAsync.mockResolvedValueOnce({
        status: 'denied',
      });

      const { result } = renderHook(() => useImagePicker());

      let pickedImage: unknown;
      await act(async () => {
        pickedImage = await result.current.pickFromCamera();
      });

      expect(pickedImage).toBeNull();
      expect(result.current.hasCameraPermission).toBe(false);
      expect(Alert.alert).toHaveBeenCalled();
    });

    it('returns captured image on success', async () => {
      const mockAsset = {
        uri: 'file://camera.jpg',
        width: 2000,
        height: 2000,
        mimeType: 'image/jpeg',
      };

      mockRequestCameraPermissionsAsync.mockResolvedValueOnce({
        status: 'granted',
      });
      mockLaunchCameraAsync.mockResolvedValueOnce({
        canceled: false,
        assets: [mockAsset],
      });

      const { result } = renderHook(() => useImagePicker());

      let pickedImage: unknown;
      await act(async () => {
        pickedImage = await result.current.pickFromCamera();
      });

      expect(pickedImage).toEqual({
        uri: 'file://camera.jpg',
        width: 2000,
        height: 2000,
        type: 'image',
        mimeType: 'image/jpeg',
        fileSize: undefined,
      });
    });
  });

  describe('pickWithChoice', () => {
    it('shows alert with camera and library options', async () => {
      const { result } = renderHook(() => useImagePicker());

      // Start picking (will trigger alert)
      act(() => {
        result.current.pickWithChoice();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Add Image',
        'Choose how to add an image to your Vision Board',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Take Photo' }),
          expect.objectContaining({ text: 'Choose from Library' }),
          expect.objectContaining({ text: 'Cancel' }),
        ])
      );
    });
  });

  describe('clearImage', () => {
    it('clears the current image and error', async () => {
      const mockAsset = {
        uri: 'file://test.jpg',
        width: 1000,
        height: 1000,
        mimeType: 'image/jpeg',
      };

      mockRequestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: 'granted',
      });
      mockLaunchImageLibraryAsync.mockResolvedValueOnce({
        canceled: false,
        assets: [mockAsset],
      });

      const { result } = renderHook(() => useImagePicker());

      // Pick an image first
      await act(async () => {
        await result.current.pickFromLibrary();
      });

      expect(result.current.image).not.toBeNull();

      // Clear it
      act(() => {
        result.current.clearImage();
      });

      expect(result.current.image).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe('error handling', () => {
    it('sets error when picker throws', async () => {
      mockRequestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: 'granted',
      });
      mockLaunchImageLibraryAsync.mockRejectedValueOnce(
        new Error('Picker failed')
      );

      const { result } = renderHook(() => useImagePicker());

      await act(async () => {
        await result.current.pickFromLibrary();
      });

      expect(result.current.error).toBe('Picker failed');
      expect(result.current.isLoading).toBe(false);
    });

    it('handles non-Error throws gracefully', async () => {
      mockRequestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: 'granted',
      });
      mockLaunchImageLibraryAsync.mockRejectedValueOnce('string error');

      const { result } = renderHook(() => useImagePicker());

      await act(async () => {
        await result.current.pickFromLibrary();
      });

      expect(result.current.error).toBe('Failed to pick image');
    });
  });

  describe('requestPermissions', () => {
    it('updates camera permission state', async () => {
      mockRequestCameraPermissionsAsync.mockResolvedValueOnce({
        status: 'granted',
      });

      const { result } = renderHook(() => useImagePicker());

      let granted: boolean | undefined;
      await act(async () => {
        granted = await result.current.requestPermissions('camera');
      });

      expect(granted).toBe(true);
      expect(result.current.hasCameraPermission).toBe(true);
    });

    it('updates library permission state', async () => {
      mockRequestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: 'granted',
      });

      const { result } = renderHook(() => useImagePicker());

      let granted: boolean | undefined;
      await act(async () => {
        granted = await result.current.requestPermissions('library');
      });

      expect(granted).toBe(true);
      expect(result.current.hasLibraryPermission).toBe(true);
    });
  });
});
