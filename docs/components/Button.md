# Button

A styled button component with variants and sizes.

## Props

- `variant?: "primary" | "secondary" | "success" | "danger" | "ghost"` — visual style. Default: `"primary"`.
- `size?: "sm" | "md" | "lg"` — control padding/typography. Default: `"md"`.
- Inherits all `React.ButtonHTMLAttributes<HTMLButtonElement>`.

## Usage

```tsx
import { Button } from "src/components/Button";

<Button onClick={() => {}}>Click me</Button>
<Button variant="secondary">Secondary</Button>
<Button size="lg" variant="success">Save</Button>
<Button disabled variant="ghost">Disabled</Button>
```

## Accessibility

- Renders a native `button` with proper focus-ring classes.
