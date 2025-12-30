/**
 * VisionBoardSection Component
 * Photo grid of motivational images for habits
 *
 * Part of the Motivation System Workshop tab
 * Story T12.2-T12.7: Vision Board feature
 *
 * Scientific Basis:
 * - Visual motivation reinforces goals through mental imagery
 * - Personal images > stock images for emotional connection (Brewer, 2018)
 * - Mirror neurons activate when viewing goal-related imagery
 * - Mental contrasting with visual cues improves goal pursuit (Oettingen, 2014)
 *
 * Business Model:
 * - Premium feature: storage costs, personalization, high perceived value
 * - Users pay for customization (Notion model)
 * - 4-image grid per habit for premium users
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  FadeIn,
  FadeOut,
  runOnJS,
} from 'react-native-reanimated';
import {
  Image as ImageIcon,
  Plus,
  Check,
  X,
  Camera,
  ImagePlus,
  Trash2,
  Edit3,
  Sparkles,
  ZoomIn,
  Grid3x3,
} from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import {
  PulsingIcon,
  CompletionCheckmark,
  SPRING_BUTTON,
  SPRING_GENTLE,
  STAGGER_DELAY,
} from '../../animations';
import {
  useImagePicker,
  type PickedImage,
} from '../../../hooks/useImagePicker';
import { useImageUpload } from '../../../hooks/useImageUpload';
import type { Id } from '../../../../convex/_generated/dataModel';
import { useEffect } from 'react';

export interface VisionBoardImage {
  id: string;
  storageId: Id<'_storage'>;
  imageUrl: string | null;
  caption?: string;
  order: number;
  createdAt: number;
}

export interface VisionBoardSectionProps {
  /** List of existing images */
  images: VisionBoardImage[];
  /** Number of images (for analytics) */
  imageCount: number;
  /** Whether user has premium access */
  isPremium: boolean;
  /** Callback when a new image is added */
  onAddImage: (storageId: Id<'_storage'>, caption?: string) => Promise<void>;
  /** Callback when an image caption is updated */
  onUpdateCaption: (imageId: string, caption?: string) => Promise<void>;
  /** Callback when an image is deleted */
  onDeleteImage: (imageId: string) => Promise<void>;
  /** Callback when user hits premium limit */
  onPremiumRequired: () => void;
  /** Whether to run entrance animations */
  shouldAnimate?: boolean;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Section index for staggered animation timing */
  sectionIndex?: number;
}

// Maximum images per habit (4-image grid as per spec)
const MAX_IMAGES = 4;

// Maximum caption length (matching Convex validation)
const MAX_CAPTION_LENGTH = 200;

// Get screen width for image sizing
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_SIZE = (SCREEN_WIDTH - 64) / 2; // 2 columns with padding

/**
 * SectionCard Component for consistent styling with press animation
 */
function SectionCard({
  children,
  className,
  onPress,
  accessibilityLabel,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.08);
  const elevation = useSharedValue(2);

  const animatedStyle = useAnimatedStyle(() => ({
    elevation: elevation.value,
    shadowOffset: {
      height: interpolate(elevation.value, [1, 2], [1, 2]),
      width: 0,
    },
    shadowOpacity: shadowOpacity.value,
    shadowRadius: interpolate(elevation.value, [1, 2], [2, 4]),
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    'worklet';
    scale.value = withSpring(0.98, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.04, SPRING_BUTTON);
    elevation.value = withSpring(1, SPRING_BUTTON);
  }, [scale, shadowOpacity, elevation]);

  const handlePressOut = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.08, SPRING_BUTTON);
    elevation.value = withSpring(2, SPRING_BUTTON);
  }, [scale, shadowOpacity, elevation]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  }, [onPress]);

  if (onPress) {
    return (
      <Animated.View style={[animatedStyle, { shadowColor: '#78716c' }]}>
        <Pressable
          accessibilityLabel={accessibilityLabel}
          accessibilityRole='button'
          accessibilityState={{ disabled }}
          className={clsx('rounded-2xl bg-white p-4', className)}
          disabled={disabled}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View
      className={clsx(
        'rounded-2xl bg-white p-4 shadow-sm shadow-stone-200/50',
        className
      )}
    >
      {children}
    </View>
  );
}

/**
 * AnimatedSection Component for staggered entrance animations
 */
function AnimatedSection({
  children,
  index,
  shouldAnimate,
  reduceMotion = false,
}: {
  children: React.ReactNode;
  index: number;
  shouldAnimate: boolean;
  reduceMotion?: boolean;
}) {
  const INITIAL_TRANSLATE_Y = 24;

  const translateY = useSharedValue(
    shouldAnimate && !reduceMotion ? INITIAL_TRANSLATE_Y : 0
  );
  const opacity = useSharedValue(shouldAnimate && !reduceMotion ? 0 : 1);

  useEffect(() => {
    if (!shouldAnimate || reduceMotion) {
      translateY.value = 0;
      opacity.value = 1;
      return;
    }

    const delay = index * STAGGER_DELAY;

    const timeout = setTimeout(() => {
      translateY.value = withSpring(0, SPRING_GENTLE);
      opacity.value = withTiming(1, { duration: 300 });
    }, delay);

    return () => clearTimeout(timeout);
  }, [shouldAnimate, reduceMotion, index, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * ImageGridCell Component - Single image cell in the grid
 */
function ImageGridCell({
  image,
  index,
  onPress,
  onDelete,
  onEditCaption,
  isLoading,
}: {
  image?: VisionBoardImage;
  index: number;
  onPress?: () => void;
  onDelete?: () => void;
  onEditCaption?: () => void;
  isLoading?: boolean;
}) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, SPRING_BUTTON);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BUTTON);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Empty cell (add button)
  if (!image) {
    return (
      <Animated.View style={animatedStyle}>
        <Pressable
          accessibilityLabel={`Add image to slot ${index + 1}`}
          accessibilityRole='button'
          className='items-center justify-center rounded-xl border-2 border-dashed border-fuchsia-300 bg-fuchsia-50'
          style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {isLoading ? (
            <ActivityIndicator color='#d946ef' size='small' />
          ) : (
            <View className='items-center gap-1'>
              <View className='h-10 w-10 items-center justify-center rounded-full bg-fuchsia-100'>
                <Plus className='text-fuchsia-500' size={20} />
              </View>
              <Text className='text-xs font-medium text-fuchsia-500'>
                Add Image
              </Text>
            </View>
          )}
        </Pressable>
      </Animated.View>
    );
  }

  // Image cell
  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityLabel={image.caption || `Vision board image ${index + 1}`}
        accessibilityRole='button'
        className='overflow-hidden rounded-xl bg-stone-100'
        style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {image.imageUrl ? (
          <Image
            accessibilityIgnoresInvertColors
            resizeMode='cover'
            source={{ uri: image.imageUrl }}
            style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
          />
        ) : (
          <View className='flex-1 items-center justify-center bg-stone-200'>
            <ActivityIndicator color='#a8a29e' size='small' />
          </View>
        )}

        {/* Caption overlay */}
        {image.caption && (
          <View className='absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1'>
            <Text className='text-xs text-white' numberOfLines={2}>
              {image.caption}
            </Text>
          </View>
        )}

        {/* Zoom indicator */}
        <View className='absolute right-2 top-2 h-6 w-6 items-center justify-center rounded-full bg-black/30'>
          <ZoomIn className='text-white' size={12} />
        </View>

        {/* Action buttons on long press could be added here */}
      </Pressable>
    </Animated.View>
  );
}

/**
 * ImageGrid Component - 2x2 grid of images
 */
function ImageGrid({
  images,
  onAddImage,
  onViewImage,
  isUploading,
}: {
  images: VisionBoardImage[];
  onAddImage: () => void;
  onViewImage: (image: VisionBoardImage) => void;
  isUploading: boolean;
}) {
  // Fill remaining slots with empty cells
  const gridItems: (VisionBoardImage | null)[] = [...images];
  while (gridItems.length < MAX_IMAGES) {
    gridItems.push(null);
  }

  return (
    <View className='mt-4 flex-row flex-wrap justify-between gap-y-3'>
      {gridItems.map((image, index) => (
        <ImageGridCell
          key={image?.id || `empty-${index}`}
          image={image || undefined}
          index={index}
          isLoading={isUploading && !image && index === images.length}
          onPress={() => {
            if (image) {
              onViewImage(image);
            } else {
              onAddImage();
            }
          }}
        />
      ))}
    </View>
  );
}

/**
 * ImageViewerModal Component - Full-size image viewer
 */
function ImageViewerModal({
  visible,
  image,
  onClose,
  onUpdateCaption,
  onDelete,
}: {
  visible: boolean;
  image: VisionBoardImage | null;
  onClose: () => void;
  onUpdateCaption: (caption?: string) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [captionText, setCaptionText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset state when image changes
  useEffect(() => {
    if (image) {
      setCaptionText(image.caption || '');
      setIsEditingCaption(false);
    }
  }, [image?.id]);

  const handleSaveCaption = useCallback(async () => {
    setIsSaving(true);
    try {
      await onUpdateCaption(captionText.trim() || undefined);
      setIsEditingCaption(false);
    } catch (error) {
      console.error('Failed to save caption:', error);
    } finally {
      setIsSaving(false);
    }
  }, [captionText, onUpdateCaption]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to remove this image from your Vision Board?',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: async () => {
            setIsDeleting(true);
            try {
              await onDelete();
              onClose();
            } catch (error) {
              console.error('Failed to delete image:', error);
            } finally {
              setIsDeleting(false);
            }
          },
          style: 'destructive',
          text: 'Delete',
        },
      ]
    );
  }, [onDelete, onClose]);

  if (!image) return null;

  return (
    <Modal
      animationType='fade'
      presentationStyle='fullScreen'
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1 bg-black'
      >
        {/* Header */}
        <View className='flex-row items-center justify-between px-4 pb-4 pt-14'>
          <Pressable
            accessibilityLabel='Close image viewer'
            accessibilityRole='button'
            className='h-10 w-10 items-center justify-center rounded-full bg-white/10'
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
          >
            <X className='text-white' size={20} />
          </Pressable>
          <View className='flex-row gap-2'>
            <Pressable
              accessibilityLabel='Edit caption'
              accessibilityRole='button'
              className='h-10 w-10 items-center justify-center rounded-full bg-white/10'
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsEditingCaption(!isEditingCaption);
              }}
            >
              <Edit3 className='text-white' size={20} />
            </Pressable>
            <Pressable
              accessibilityLabel='Delete image'
              accessibilityRole='button'
              className='h-10 w-10 items-center justify-center rounded-full bg-white/10'
              disabled={isDeleting}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleDelete();
              }}
            >
              {isDeleting ? (
                <ActivityIndicator color='#fff' size='small' />
              ) : (
                <Trash2 className='text-white' size={20} />
              )}
            </Pressable>
          </View>
        </View>

        {/* Image */}
        <View className='flex-1 items-center justify-center'>
          {image.imageUrl && (
            <Image
              accessibilityIgnoresInvertColors
              resizeMode='contain'
              source={{ uri: image.imageUrl }}
              style={{ height: SCREEN_WIDTH, width: SCREEN_WIDTH }}
            />
          )}
        </View>

        {/* Caption area */}
        <View className='px-4 pb-10 pt-4'>
          {isEditingCaption ? (
            <View className='gap-3'>
              <TextInput
                autoFocus
                multiline
                className='rounded-xl bg-white/10 px-4 py-3 text-base text-white'
                maxLength={MAX_CAPTION_LENGTH}
                placeholder='Add a caption...'
                placeholderTextColor='#a8a29e'
                value={captionText}
                onChangeText={setCaptionText}
              />
              <View className='flex-row items-center justify-between'>
                <Text className='text-xs text-stone-400'>
                  {captionText.length}/{MAX_CAPTION_LENGTH}
                </Text>
                <View className='flex-row gap-2'>
                  <Pressable
                    accessibilityLabel='Cancel editing'
                    className='rounded-lg bg-stone-700 px-4 py-2'
                    onPress={() => {
                      setCaptionText(image.caption || '');
                      setIsEditingCaption(false);
                    }}
                  >
                    <Text className='font-medium text-white'>Cancel</Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel='Save caption'
                    className='rounded-lg bg-fuchsia-500 px-4 py-2'
                    disabled={isSaving}
                    onPress={handleSaveCaption}
                  >
                    <Text className='font-medium text-white'>
                      {isSaving ? 'Saving...' : 'Save'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : (
            <View className='min-h-[48px] items-center justify-center'>
              {image.caption ? (
                <Text className='text-center text-base text-white'>
                  {image.caption}
                </Text>
              ) : (
                <Text className='text-center text-base text-stone-500'>
                  Tap the edit button to add a caption
                </Text>
              )}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/**
 * AddImageModal Component - Modal for adding new image
 */
function AddImageModal({
  visible,
  onClose,
  onPickFromCamera,
  onPickFromLibrary,
}: {
  visible: boolean;
  onClose: () => void;
  onPickFromCamera: () => void;
  onPickFromLibrary: () => void;
}) {
  return (
    <Modal
      transparent
      animationType='fade'
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        className='flex-1 items-center justify-center bg-black/50'
        onPress={onClose}
      >
        <Pressable
          className='mx-6 w-full max-w-sm rounded-2xl bg-white p-6'
          onPress={(e) => e.stopPropagation()}
        >
          <View className='mb-4 flex-row items-center gap-3'>
            <View className='h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-100'>
              <ImagePlus className='text-fuchsia-600' size={20} />
            </View>
            <View>
              <Text className='text-lg font-bold text-stone-800'>
                Add to Vision Board
              </Text>
              <Text className='text-xs text-stone-500'>
                Choose how to add your image
              </Text>
            </View>
          </View>

          <View className='gap-2'>
            <Pressable
              accessibilityLabel='Take a photo'
              accessibilityRole='button'
              className='flex-row items-center gap-3 rounded-xl border border-stone-200 p-4'
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPickFromCamera();
                onClose();
              }}
            >
              <View className='h-10 w-10 items-center justify-center rounded-full bg-fuchsia-100'>
                <Camera className='text-fuchsia-500' size={20} />
              </View>
              <View className='flex-1'>
                <Text className='font-medium text-stone-800'>Take Photo</Text>
                <Text className='text-xs text-stone-500'>
                  Use your camera to capture an image
                </Text>
              </View>
            </Pressable>

            <Pressable
              accessibilityLabel='Choose from library'
              accessibilityRole='button'
              className='flex-row items-center gap-3 rounded-xl border border-stone-200 p-4'
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPickFromLibrary();
                onClose();
              }}
            >
              <View className='h-10 w-10 items-center justify-center rounded-full bg-fuchsia-100'>
                <ImageIcon className='text-fuchsia-500' size={20} />
              </View>
              <View className='flex-1'>
                <Text className='font-medium text-stone-800'>
                  Choose from Library
                </Text>
                <Text className='text-xs text-stone-500'>
                  Select an existing photo
                </Text>
              </View>
            </Pressable>
          </View>

          <Pressable
            accessibilityLabel='Cancel'
            accessibilityRole='button'
            className='mt-4 items-center py-2'
            onPress={onClose}
          >
            <Text className='font-medium text-stone-500'>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/**
 * VisionBoardSection - Main component
 *
 * Displays Vision Board section with:
 * - Empty state: Pulsing image icon with "Add Images" CTA
 * - Filled state: 2x2 grid of images with add slots
 * - Premium badge and gating
 * - Fuchsia accent color
 */
export function VisionBoardSection({
  images,
  imageCount,
  isPremium,
  onAddImage,
  onUpdateCaption,
  onDeleteImage,
  onPremiumRequired,
  shouldAnimate = false,
  reduceMotion = false,
  sectionIndex = 0,
}: VisionBoardSectionProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<VisionBoardImage | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);

  // Image picker and upload hooks
  const {
    pickFromCamera,
    pickFromLibrary,
    isLoading: isPickerLoading,
  } = useImagePicker();
  const {
    uploadImage,
    isUploading: isUploadInProgress,
    error: uploadError,
  } = useImageUpload();

  const hasImages = imageCount > 0;
  const canAddMore = imageCount < MAX_IMAGES;

  const handleAddImage = useCallback(
    async (source: 'camera' | 'library') => {
      if (!isPremium) {
        onPremiumRequired();
        return;
      }

      if (!canAddMore) {
        Alert.alert(
          'Vision Board Full',
          `You can add up to ${MAX_IMAGES} images to your Vision Board.`
        );
        return;
      }

      setIsUploading(true);

      try {
        // Pick image
        const image =
          source === 'camera'
            ? await pickFromCamera({ aspect: [1, 1], quality: 0.8 })
            : await pickFromLibrary({ aspect: [1, 1], quality: 0.8 });

        if (!image) {
          setIsUploading(false);
          return;
        }

        // Upload to storage
        const result = await uploadImage(image);
        if (!result) {
          throw new Error('Failed to upload image');
        }

        // Save to database
        await onAddImage(result.storageId);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.error('Failed to add image:', error);
        Alert.alert(
          'Upload Failed',
          'There was a problem adding your image. Please try again.'
        );
      } finally {
        setIsUploading(false);
      }
    },
    [
      isPremium,
      canAddMore,
      pickFromCamera,
      pickFromLibrary,
      uploadImage,
      onAddImage,
      onPremiumRequired,
    ]
  );

  const handleViewImage = useCallback((image: VisionBoardImage) => {
    setSelectedImage(image);
    setIsViewerOpen(true);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setIsViewerOpen(false);
    setTimeout(() => setSelectedImage(null), 300);
  }, []);

  const handleUpdateCaption = useCallback(
    async (caption?: string) => {
      if (!selectedImage) return;
      await onUpdateCaption(selectedImage.id, caption);
    },
    [selectedImage, onUpdateCaption]
  );

  const handleDeleteImage = useCallback(async () => {
    if (!selectedImage) return;
    await onDeleteImage(selectedImage.id);
  }, [selectedImage, onDeleteImage]);

  const handleSectionPress = useCallback(() => {
    if (!isPremium) {
      onPremiumRequired();
    }
  }, [isPremium, onPremiumRequired]);

  const isLoading = isPickerLoading || isUploadInProgress || isUploading;

  return (
    <>
      <AnimatedSection
        index={sectionIndex}
        reduceMotion={reduceMotion}
        shouldAnimate={shouldAnimate}
      >
        <SectionCard
          accessibilityLabel={
            hasImages
              ? `Vision Board with ${imageCount} images`
              : 'Create your Vision Board with motivational images'
          }
          className='border-l-4 border-l-fuchsia-400'
          onPress={handleSectionPress}
        >
          <View className='flex-row items-start gap-3'>
            {/* Icon with completion checkmark */}
            <View className='relative h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-100'>
              {hasImages ? (
                <Grid3x3 className='text-fuchsia-500' size={20} />
              ) : (
                <PulsingIcon reduceMotion={reduceMotion}>
                  <ImageIcon className='text-fuchsia-500' size={20} />
                </PulsingIcon>
              )}
              <CompletionCheckmark
                isVisible={hasImages}
                reduceMotion={reduceMotion}
                sectionIndex={sectionIndex}
                shouldAnimate={shouldAnimate}
              />
            </View>

            {/* Content area */}
            <View className='flex-1'>
              <View className='mb-1 flex-row items-center justify-between'>
                <View className='flex-row items-center gap-2'>
                  <Text className='font-semibold text-stone-800'>
                    Vision Board
                  </Text>
                  {!isPremium && (
                    <View className='rounded-full bg-amber-100 px-2 py-0.5'>
                      <Text className='text-xs font-medium text-amber-700'>
                        PRO
                      </Text>
                    </View>
                  )}
                </View>
                {hasImages && (
                  <Text className='text-xs font-medium text-fuchsia-600'>
                    {imageCount}/{MAX_IMAGES}
                  </Text>
                )}
                {!hasImages && (
                  <View className='flex-row items-center gap-1'>
                    <Plus className='text-fuchsia-600' size={12} />
                    <Text className='text-xs font-medium text-fuchsia-600'>
                      Add
                    </Text>
                  </View>
                )}
              </View>

              {/* Description */}
              {!hasImages && (
                <Text className='text-sm text-stone-500'>
                  Add photos that inspire your habit journey
                </Text>
              )}

              {/* Science tip */}
              {!hasImages && (
                <View className='mt-2 flex-row items-start gap-1.5 rounded-lg bg-fuchsia-50 px-2 py-1.5'>
                  <Sparkles className='mt-0.5 text-fuchsia-500' size={12} />
                  <Text className='flex-1 text-xs text-fuchsia-700'>
                    Visual cues activate mirror neurons and reinforce motivation
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Image Grid */}
          {isPremium && (
            <ImageGrid
              images={images}
              isUploading={isLoading}
              onAddImage={() => setIsAddModalOpen(true)}
              onViewImage={handleViewImage}
            />
          )}

          {/* Add Images button for empty state */}
          {isPremium && !hasImages && !isLoading && (
            <View className='mt-4 items-center'>
              <Pressable
                accessibilityLabel='Add your first image'
                accessibilityRole='button'
                className='flex-row items-center gap-2 rounded-full bg-fuchsia-500 px-4 py-2'
                onPress={() => setIsAddModalOpen(true)}
              >
                <ImagePlus className='text-white' size={16} />
                <Text className='font-medium text-white'>
                  Add Your First Image
                </Text>
              </Pressable>
            </View>
          )}
        </SectionCard>
      </AnimatedSection>

      {/* Add Image Modal */}
      <AddImageModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPickFromCamera={() => handleAddImage('camera')}
        onPickFromLibrary={() => handleAddImage('library')}
      />

      {/* Image Viewer Modal */}
      <ImageViewerModal
        image={selectedImage}
        visible={isViewerOpen}
        onClose={handleCloseViewer}
        onDelete={handleDeleteImage}
        onUpdateCaption={handleUpdateCaption}
      />
    </>
  );
}

export default VisionBoardSection;
