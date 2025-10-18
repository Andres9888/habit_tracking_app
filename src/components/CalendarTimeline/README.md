# CalendarTimeline Component

A horizontal scrollable calendar timeline component that displays dates in a clean, minimal design based on Figma specifications.

## Features

- Horizontal scrollable layout
- Displays weekday names (Mon, Tue, Wed, etc.) and date numbers
- Optional date selection functionality
- Optional gradient separator line
- Fully typed with TypeScript
- Optimized with React.memo for performance
- Uses NativeWind (Tailwind CSS for React Native)

## Design Specs

Based on Figma node 201:87:

- **Typography:**
  - Day names: Inter Regular, 12px, #6a7282
  - Date numbers: Inter Regular, 16px, #4a5565, -0.3125px letter spacing
- **Layout:**
  - Container padding: 24px horizontal
  - Column width: 60px
  - Gap between items: 24px
  - Gap between day name and number: 8px
- **Colors:**
  - Separator: #ffb86a (orange/gold)

## Usage

### Basic Usage

```tsx
import { CalendarTimeline } from '@/components/CalendarTimeline';
import { addDays } from 'date-fns';

function MyScreen() {
  // Generate array of 5 dates starting from today
  const today = new Date();
  const dates = Array.from({ length: 5 }, (_, i) => addDays(today, i));

  return <CalendarTimeline dates={dates} />;
}
```

### With Date Selection

```tsx
import { CalendarTimeline } from '@/components/CalendarTimeline';
import { useState } from 'react';
import { addDays } from 'date-fns';

function MyScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  return (
    <CalendarTimeline
      dates={dates}
      selectedDate={selectedDate}
      onDateSelect={setSelectedDate}
      showSeparator={true}
    />
  );
}
```

### Week View (Monday-Friday)

```tsx
import { CalendarTimeline } from '@/components/CalendarTimeline';
import { startOfWeek, addDays } from 'date-fns';

function WeekView() {
  // Get Monday of current week
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });

  // Generate Mon-Fri dates
  const weekdays = Array.from({ length: 5 }, (_, i) => addDays(monday, i));

  return <CalendarTimeline dates={weekdays} showSeparator={true} />;
}
```

### Without Separator

```tsx
<CalendarTimeline dates={dates} showSeparator={false} />
```

## Props

| Prop            | Type                   | Required | Default | Description                                   |
| --------------- | ---------------------- | -------- | ------- | --------------------------------------------- |
| `dates`         | `Date[]`               | Yes      | -       | Array of dates to display in the timeline     |
| `selectedDate`  | `Date`                 | No       | -       | Currently selected date (highlights the date) |
| `onDateSelect`  | `(date: Date) => void` | No       | -       | Callback when a date is selected              |
| `showSeparator` | `boolean`              | No       | `true`  | Whether to show the gradient separator line   |

## Styling

The component uses NativeWind classes and can be customized by modifying the Tailwind classes in the component file. The design closely matches the Figma specifications:

- Day labels: `text-[#6a7282]`
- Date numbers: `text-[#4a5565]`
- Selected date: `text-[#101727]` with `font-semibold`
- Separator: `#ffb86a` with 50% opacity

## Accessibility

- Horizontal scrolling is enabled for all dates
- Text is rendered with semantic markup
- Component is memoized for optimal performance

## File Structure

```
CalendarTimeline/
├── CalendarTimeline.tsx       # Main component
├── CalendarTimeline.hooks.ts  # Custom hooks for component logic
├── index.ts                    # Exports
└── README.md                   # This file
```

## Dependencies

- `react` - Core React library
- `react-native` - View, Text, ScrollView components
- `date-fns` - Date formatting utilities

## Performance

The component is wrapped with `React.memo` to prevent unnecessary re-renders. Date selection logic is memoized using `useCallback` in the custom hook.

## Future Enhancements

Potential improvements:

- Add touch feedback for date selection
- Add animation for date transitions
- Support for month boundaries with visual indicators
- Customizable color schemes
- RTL (right-to-left) support
