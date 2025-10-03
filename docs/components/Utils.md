# Utilities

## `cn(...inputs: ClassValue[])`

Merges Tailwind class names with `clsx` and `tailwind-merge`.

```ts
import { cn } from "src/lib/utils";

div.className = cn("p-2", isActive && "bg-primary");
```
