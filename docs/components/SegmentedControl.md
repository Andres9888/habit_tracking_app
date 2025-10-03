# SegmentedControl

Accessible segmented control for switching between views.

## Generics

- `T extends string` — the value type for segments.

## Props

- `segments: Array<{ value: T; label: string }>`
- `value: T`
- `onChange: (value: T) => void`
- `className?: string`

## Usage

```tsx
import { SegmentedControl } from "src/components/SegmentedControl";

type ViewMode = "list" | "grid";

<SegmentedControl<ViewMode>
  segments={[
    { value: "list", label: "List" },
    { value: "grid", label: "Grid" },
  ]}
  value={mode}
  onChange={setMode}
/>
```
