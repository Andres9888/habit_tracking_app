# ChainLinkIcon Component

A custom SVG chain link icon component for React Native, built using `react-native-svg`.

## Features

- Custom SVG path representing two interlocking chain links
- Fully customizable color and size
- TypeScript support with proper prop typing
- Based on Figma design specifications (viewBox="0 0 20 16")
- Zero external icon dependencies

## Usage

```tsx
import { ChainLinkIcon } from './components/ChainLinkIcon';

// Default usage (white, 20x20)
<ChainLinkIcon />

// Custom color
<ChainLinkIcon color="#48bb78" />

// Custom size
<ChainLinkIcon size={24} />

// Both custom color and size
<ChainLinkIcon color="#ff6b6b" size={32} />
```

## Props

| Prop  | Type   | Default     | Description                  |
| ----- | ------ | ----------- | ---------------------------- |
| color | string | `"#ffffff"` | Stroke color of the icon     |
| size  | number | `20`        | Width and height of the icon |

## Implementation Details

- Uses `react-native-svg` for cross-platform SVG rendering
- Path includes two rounded rectangles (chain links) connected by a horizontal line
- Stroke width is 2px with rounded line caps for smooth appearance
- Fill is set to "none" to show only the outline

## Visual Specifications

- **ViewBox**: 0 0 20 16
- **Stroke Width**: 2
- **Stroke Linecap**: round
- **Fill**: none

## Design

The icon consists of:

1. Left chain link (rounded rectangle from x=1.5 to x=7)
2. Right chain link (rounded rectangle from x=13 to x=18.5)
3. Connecting line between the two links (from x=5.5 to x=14.5)

All elements use stroke rendering with rounded corners for a modern, clean look.

## Testing

Tests are located in `src/components/__tests__/ChainLinkIcon.test.tsx` and verify:

- Default rendering
- Custom color rendering
- Custom size rendering
- Combined custom props rendering
- ViewBox dimensions

Run tests with:

```bash
npm test -- ChainLinkIcon.test.tsx
```
