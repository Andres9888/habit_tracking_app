# Feature Idea: GTD Voice Capture System

**Captured:** 2026-01-27
**Status:** Idea/Brainstorm
**Priority:** Future consideration (post-App Store launch)

---

## Concept Overview

A voice-first task capture system that flows through AI processing to create actionable, categorized content with GTD methodology built-in.

### Pipeline

```
Voice Input → Transcription → AI Processing → Structured Task/Content
```

### Core Attributes (Per Task)

| Attribute | Options | Purpose |
|-----------|---------|---------|
| **Time Estimate** | 2 min, 5 min, 15 min, 30 min, 1 hr, 2+ hr | GTD "next action" sizing |
| **Energy Level** | Low, Medium, High | Match tasks to current energy state |
| **Context** | @home, @work, @phone, @computer, @errands, @anywhere | GTD context filtering |
| **Value Type** | Revenue-driving, Growth, Maintenance, Personal | Prioritize money-makers |
| **Goal Alignment** | Links to specific monetary/life goal | Track ROI of time spent |

---

## User Flow

### 1. Voice Capture
- User speaks task/idea naturally
- "I need to write the pitch deck for the investor meeting, probably takes 2 hours, need high focus"

### 2. AI Processing
- Extracts: Task name, time estimate, energy requirement
- Suggests: Context, value type, goal alignment
- Structures: Clean task with all metadata

### 3. Smart Queuing
- Tasks sorted by:
  - Current energy level (user sets on app open)
  - Available time block
  - Context match (where are you?)
  - Value priority (revenue tasks surface first)

### 4. Content Generation
- AI can expand tasks into content:
  - Voice note → Blog post draft
  - Idea capture → Project outline
  - Meeting note → Action items

---

## GTD Integration Points

### Weekly Review
- Show tasks by context
- Highlight revenue-driving tasks completed
- Surface stuck/stale tasks

### Daily Planning
- "You have 2 hours and medium energy - here are 4 tasks that fit"
- Batch similar contexts together

### Goal Tracking
- Track time spent on revenue vs maintenance
- ROI calculation: hours invested → revenue generated

---

## Technical Considerations

### Voice Processing
- Whisper API for transcription
- GPT-4 for intent extraction and structuring

### Data Model
```typescript
interface GTDTask {
  id: string;
  title: string;
  rawVoiceNote?: string;
  transcription?: string;

  // GTD Attributes
  timeEstimate: '2min' | '5min' | '15min' | '30min' | '1hr' | '2hr+';
  energyLevel: 'low' | 'medium' | 'high';
  context: string[]; // @home, @work, etc.

  // Value System
  valueType: 'revenue' | 'growth' | 'maintenance' | 'personal';
  linkedGoal?: string; // Reference to monetary/life goal
  estimatedValue?: number; // $ potential

  // Status
  status: 'inbox' | 'next' | 'waiting' | 'someday' | 'done';
  completedAt?: Date;
  actualTime?: number; // Track accuracy of estimates
}
```

### Integration with Habit App
- Habits = recurring commitments
- GTD tasks = one-off actions
- Both feed into "daily intention" system
- Voice notes already exist in Motivation System - could extend

---

## Questions to Explore

1. Does this belong in the Habit app or as a separate product?
2. How does this interact with existing habit tracking?
3. What's the MVP vs full vision?
4. Monetization: Premium feature or separate subscription?

---

## Related Existing Features

- **Voice Notes** in Motivation System (`src/components/MotivationSystem/Workshop/VoiceNotesSection/`)
- **Daily Focus** concept in app
- **Goal tracking** infrastructure

---

## Next Steps (When Ready)

1. Define MVP scope
2. User research on GTD + voice capture pain points
3. Prototype AI task extraction
4. Design task queue UI
5. Build voice → task pipeline
