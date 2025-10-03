# Switch

Toggle switch component with sizes.

## Props

- `checked?: boolean`
- `defaultChecked?: boolean`
- `disabled?: boolean`
- `id?: string`
- `name?: string`
- `onChange?: React.ChangeEventHandler<HTMLInputElement>`
- `size?: "sm" | "md" | "lg"` — Default: `"md"`
- `className?: string`
- Inherits other `InputHTMLAttributes` (except `type` and `size`).

## Usage

```tsx
import { Switch } from "src/components/Switch";

<Switch checked={enabled} onChange={() => setEnabled(!enabled)} />
<Switch size="lg" />
```
