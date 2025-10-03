# Checkbox

Custom checkbox supporting sizes, variants, and indeterminate state.

## Props

- `checked?: boolean`
- `defaultChecked?: boolean`
- `disabled?: boolean`
- `id?: string`
- `name?: string`
- `onChange?: React.ChangeEventHandler<HTMLInputElement>`
- `variant?: "primary" | "success" | "neutral" | "danger"` — Default: `"primary"`
- `size?: "sm" | "md" | "lg"` — Default: `"md"`
- `indeterminate?: boolean` — Shows horizontal line when true and not checked
- `className?: string`
- Inherits other `InputHTMLAttributes` (except `type` and `size`).

## Usage

```tsx
import { Checkbox } from "src/components/Checkbox";

<Checkbox checked={value} onChange={(e) => setValue(e.target.checked)} />
<Checkbox indeterminate />
<Checkbox size="lg" variant="danger" />
```

## Notes

- Uses an invisible input with a styled box for full control and accessibility.
- Supports `ref` forwarding.
