# Habit Sharing Feature

## Overview

The Habit Sharing feature allows users to share custom habit templates with friends and import habits shared by others via deep links and QR codes.

## Features

### 1. Share Habit Templates
- **Location**: Habit Detail Screen → Share button (next to Edit)
- **Format**: Deep link with base64-encoded habit data
- **Scheme**: `habit-tracker://import?data=...`
- **Web fallback**: `https://chainday.app/import?data=...`

### 2. QR Code Generation
- Generate QR codes for in-person sharing
- Displayed in Share Modal
- Uses web fallback URL for maximum compatibility

### 3. Import Shared Habits
- Deep linking handles both app scheme and web URLs
- Automatic import when user opens a share link
- Success toast notification with haptic feedback
- Error handling with alert dialog

### 4. Share Methods
- **Share Sheet**: Native iOS/Android share dialog
- **Copy Link**: Copy deep link to clipboard with confirmation
- **QR Code**: Display QR code for scanning

## Shareable Data Format

The following habit fields are included in shared templates:

**Core Fields:**
- `name` - Habit name
- `icon` - Emoji icon
- `color` - Background color
- `iconColor` - Icon background color
- `notes` - Description/notes

**Schedule:**
- `frequency` - How often (daily, weekly, etc.)
- `daysOfWeek` - Specific days for weekly habits
- `preferredTime` - Suggested time of day

**Goals:**
- `goalDuration` - Target duration
- `goalUnit` - Unit (minutes, hours, etc.)

**Cues:**
- `cueTime` - Time-based cue
- `cueLocation` - Location cue
- `cueAfterBehavior` - Behavior chain cue

**Identity & Motivation:**
- `why` - User's reason
- `identity` - Identity statement
- `tags` - Categories

**Visualization:**
- `vizSuccessBody/Emotion/Mind` - Success visualization
- `vizFailureBody/Emotion/Mind` - Failure visualization

**WOOP Framework:**
- `woopWish/Outcome/Obstacle/Plan` - WOOP method fields

**Excluded:**
- User ID
- Streak data
- Completion history
- Internal strength/accessibility metrics
- Archive/pause status

## Implementation Details

### Files Added/Modified

**New Files:**
- `src/lib/habitShare.ts` - Core sharing utilities
- `src/hooks/useDeepLinking.ts` - Deep link handler hook
- `src/components/HabitShare/ShareHabitModal.tsx` - Share UI modal
- `src/components/HabitShare/QRCodeSVG.tsx` - QR code component
- `src/components/HabitShare/index.ts` - Barrel export
- `convex/habits/importShared.ts` - Import mutation

**Modified Files:**
- `src/features/habits/HabitsApp.tsx` - Added deep linking hook
- `src/screens/HabitDetailScreen/components/DetailHeader.tsx` - Added share button
- `convex/habits.ts` - Exported importShared mutation

### Dependencies Added

```json
{
  "expo-clipboard": "^6.0.4",
  "react-native-qrcode-svg": "^6.3.11"
}
```

### URL Scheme

Already configured in `app.json`:
```json
{
  "scheme": "habit-tracker"
}
```

## Usage

### Sharing a Habit

1. Open any habit detail screen
2. Tap the Share button (Share2 icon) in the header
3. Choose sharing method:
   - Tap "Share Link" to open native share sheet
   - Tap "Copy Link" to copy the link
   - Show QR code for scanning

### Importing a Habit

1. User opens a habit share link
2. Deep linking hook catches the URL
3. Habit data is parsed and validated
4. New habit is created via `importShared` mutation
5. Success toast appears with haptic feedback

## Future Enhancements

- [ ] Habit template gallery/marketplace
- [ ] Community-shared habits browse screen
- [ ] Analytics for shared habits (views, imports)
- [ ] Curated collections of habits
- [ ] Social features (following, likes)
- [ ] Import preview modal before confirming
- [ ] Batch import multiple habits
- [ ] Export/import via JSON file

## Security Considerations

- No user-identifying information is shared
- Streak data and completion history are never included
- Validation ensures only expected fields are imported
- Malformed URLs fail gracefully with error messages
- Deep links require app to be installed

## Testing

### Manual Testing Checklist

- [ ] Share button appears in habit detail header
- [ ] Share modal opens with QR code
- [ ] Copy link shows confirmation
- [ ] Native share sheet works
- [ ] QR code scans successfully
- [ ] Deep link opens app when installed
- [ ] Import creates new habit correctly
- [ ] Success toast appears after import
- [ ] Error alert shows for invalid links
- [ ] Works on both iOS and Android

### Test Links

Generate test links by sharing any habit, or use this example format:
```
habit-tracker://import?data=eyJuYW1lIjoiTWVkaXRhdGUiLCJpY29uIjoi8J-nk+KAjeKZgO-4jyIsImNvbG9yIjoiI2VjZjBmZiIsImZyZXF1ZW5jeSI6ImRhaWx5IiwicHJlZmVycmVkVGltZSI6Im1vcm5pbmcifQ
```

## PR Checklist

- [x] Core sharing utilities implemented
- [x] Deep linking hook created
- [x] Share modal with QR code
- [x] Import mutation
- [x] Share button in habit detail
- [x] Success/error handling
- [x] Documentation
- [ ] Unit tests for utilities
- [ ] E2E tests for sharing flow
- [ ] Accessibility testing
- [ ] Performance testing (large habit data)
