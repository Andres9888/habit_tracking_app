# Claude Code Hooks Configuration

This directory contains Claude Code hooks configuration for automated code review using CodeRabbit.

## Hooks Setup

### PostToolUse Hook (Edit/Write)

Automatically runs CodeRabbit review after any file edit or write operation.

**Trigger:** After `Edit` or `Write` tool use
**Action:** Reviews the modified file with CodeRabbit and displays suggestions

### SessionEnd Hook

Provides a summary at the end of each Claude Code session.

**Trigger:** When Claude Code session ends
**Action:** Shows files that were reviewed and cleans up temporary files

## How It Works

1. **File Modified**: When you edit or create a file using Claude Code
2. **CodeRabbit Review**: Automatically runs CodeRabbit CLI on the file
3. **Format Results**: Parses and displays suggestions in a readable format
4. **Actionable Feedback**: Shows line numbers, messages, and suggestions

## Output Format

```
📊 CodeRabbit Review Results:
==============================
⚠️  Line 42: Potential null pointer exception
   💡 Suggestion: Add null check before accessing property
   🔧 Severity: warning

⚠️  Line 58: Consider using const instead of let
   💡 Suggestion: Variable is never reassigned
   🔧 Severity: info
```

## Requirements

- CodeRabbit CLI installed at: `/Users/andres/.local/bin/coderabbit`
- `jq` for JSON parsing (optional, falls back to raw output)

## Files

- `settings.json` - Hook configuration
- `coderabbit-handler.sh` - Review handler script
- `coderabbit-review.json` - Temporary review results (auto-cleaned)

## Customization

Edit `.claude/settings.json` to:

- Change which file operations trigger reviews
- Adjust output formatting
- Add additional hooks for other tools

## Testing

To test the hook manually:

```bash
./.claude/coderabbit-handler.sh src/App.tsx
```

## Disabling

To temporarily disable hooks:

```bash
mv .claude/settings.json .claude/settings.json.disabled
```

To re-enable:

```bash
mv .claude/settings.json.disabled .claude/settings.json
```
