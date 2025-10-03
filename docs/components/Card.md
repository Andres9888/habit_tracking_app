# Card

Container component with optional header and content helpers.

## Exports

- `Card(props: CardProps)`
- `CardHeader(props: React.HTMLAttributes<HTMLDivElement>)`
- `CardContent(props: React.HTMLAttributes<HTMLDivElement>)`

## Props

- `CardProps` extends `React.HTMLAttributes<HTMLDivElement>`

## Usage

```tsx
import { Card, CardHeader, CardContent } from "src/components/Card";

<Card className="max-w-md">
  <CardHeader>Title</CardHeader>
  <CardContent>Body</CardContent>
</Card>
```
