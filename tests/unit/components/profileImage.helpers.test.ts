import {
  hasCustomProfileImage,
  resolveProfileImageUrl,
} from '../../../src/components/SettingsModal/profileImage.helpers';

describe('resolveProfileImageUrl', () => {
  it('uses custom Convex image when profileImageStorageId is set', () => {
    expect(
      resolveProfileImageUrl(
        {
          imageUrl: 'https://convex.cloud/custom.jpg',
          profileImageStorageId: 'storage123' as never,
        },
        'https://clerk.dev/oauth.jpg'
      )
    ).toBe('https://convex.cloud/custom.jpg');
  });

  it('falls back to Clerk when no custom upload', () => {
    expect(
      resolveProfileImageUrl(
        { imageUrl: 'https://convex.cloud/legacy.jpg' },
        'https://clerk.dev/oauth.jpg'
      )
    ).toBe('https://clerk.dev/oauth.jpg');
  });

  it('uses convex imageUrl when Clerk has no photo', () => {
    expect(
      resolveProfileImageUrl(
        { imageUrl: 'https://convex.cloud/legacy.jpg' },
        null
      )
    ).toBe('https://convex.cloud/legacy.jpg');
  });
});

describe('hasCustomProfileImage', () => {
  it('is true only when storage id is present', () => {
    expect(hasCustomProfileImage({ profileImageStorageId: 'x' as never })).toBe(
      true
    );
    expect(
      hasCustomProfileImage({ imageUrl: 'https://example.com/a.jpg' })
    ).toBe(false);
    expect(hasCustomProfileImage(null)).toBe(false);
  });
});
