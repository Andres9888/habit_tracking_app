# Habit Library UX Mocks

Interactive HTML mocks and walkthrough videos for the Habit Library UX improvements.

## Open locally

```bash
# Gallery index
open .superdesign/design_iterations/habit_library_mocks/index.html

# Or serve the folder
python3 -m http.server 8765 -d .superdesign/design_iterations/habit_library_mocks
```

## Files

| File | Description |
|------|-------------|
| `returning_user_flow.html` | Animated returning-user walkthrough (~8s) |
| `first_time_user_flow.html` | Animated first-time walkthrough (~7s) |
| `returning_user_collapsed.html` | Static: quick wins + goal chips |
| `returning_user_expanded.html` | Static: expanded goal grid |
| `first_time_user_static.html` | Static: starter pack + featured goal |
| `videos/*.mp4` | Recorded walkthrough videos |
| `screenshots/*.png` | Static screen captures |

## Re-record videos

```bash
npm run mocks:record-habit-library
```

Requires `google-chrome` (or set `CHROME_PATH`) and `ffmpeg`.
