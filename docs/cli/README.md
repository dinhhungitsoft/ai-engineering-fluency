# Copilot Token Tracker — CLI

![AI Engineering Fluency](../../assets/AI%20Engineering%20Fluency%20-%20Transparent.png)

Command-line interface for analyzing GitHub Copilot token usage from local session files. Works anywhere Copilot Chat stores its session data — no VS Code required.

📦 **npm**: [@rajbos/ai-engineering-fluency](https://www.npmjs.com/package/@rajbos/ai-engineering-fluency)

## Quick Start

```bash
# Run directly with npx (no install required)
npx @rajbos/ai-engineering-fluency stats

# Or install globally
npm install -g @rajbos/ai-engineering-fluency
ai-engineering-fluency stats
```

---

## Commands

### `stats` — Session Overview

Show discovered session files, sessions, chat turns, and token counts.

```bash
ai-engineering-fluency stats
ai-engineering-fluency stats --verbose  # Show per-folder breakdown
ai-engineering-fluency stats --json     # Machine-readable JSON output
```

```
GitHub Copilot Token Tracker - Session Statistics
==================================================

Editor Breakdown:
  Code (VS Code)          42 files   │  318 sessions  │  4,821 turns  │  2.1M tokens
  Code - Insiders          8 files   │   61 sessions  │    892 turns  │  401K tokens
  OpenCode                 3 files   │   18 sessions  │    204 turns  │   87K tokens

──────────────────────────────────────────────────────────────────────────────
Total                     53 files   │  397 sessions  │  5,917 turns  │  2.6M tokens
```

With `--json`, outputs a machine-readable payload suitable for scripting:

```json
{
  "totalFiles": 53,
  "processedFiles": 50,
  "emptyFiles": 3,
  "totalTokens": 2600000,
  "totalThinkingTokens": 0,
  "totalInteractions": 5917,
  "byEditor": {
    "vscode":          { "files": 42, "tokens": 2100000, "interactions": 4821 },
    "vscode-insiders": { "files":  8, "tokens":  401000, "interactions":  892 },
    "opencode":        { "files":  3, "tokens":   87000, "interactions":  204 }
  },
  "lastUpdated": "2025-01-15T10:30:00.000Z"
}
```

---

### `usage` — Token Usage Report

Show token usage broken down by time period.

```bash
ai-engineering-fluency usage
ai-engineering-fluency usage --models  # Show per-model breakdown
ai-engineering-fluency usage --cost    # Show estimated cost
```

```
GitHub Copilot Token Tracker - Token Usage
==========================================

Period          Input Tokens    Output Tokens   Total Tokens
──────────────────────────────────────────────────────────
Today                  8,432           12,104         20,536
Last 7 days           52,871           74,209        127,080
Last 30 days         218,540          301,883        520,423
All time           1,841,200        2,312,650      4,153,850

  --models breakdown (last 30 days):
  gpt-4o                      312,540 tokens
  claude-3.5-sonnet            98,203 tokens
  o3-mini                      71,801 tokens
  gemini-2.0-flash             37,879 tokens
```

---

### `environmental` — Environmental Impact

Show the environmental impact of your Copilot usage (CO₂ emissions, water usage, tree equivalents).

```bash
ai-engineering-fluency environmental
ai-engineering-fluency env  # Short alias
```

```
GitHub Copilot Token Tracker - Environmental Impact
====================================================

Based on your last 30 days of usage (520,423 tokens):

  CO₂ emissions    ~  0.42 kg CO₂e
  Water usage      ~  0.63 L
  Tree equivalent  ~  0.02 trees/year needed to offset

All figures are estimates based on published AI energy-use research.
```

---

### `fluency` — Fluency Score

Show your Copilot Fluency Score across multiple categories (Prompt Engineering, Context Engineering, Agentic, Tool Usage, Customization, Workflow Integration).

```bash
ai-engineering-fluency fluency
ai-engineering-fluency fluency --tips  # Show improvement tips
```

```
GitHub Copilot Token Tracker - Fluency Score
============================================

Overall stage: Collaborator  ████████████░░░░  Stage 3 of 4

  💬 Prompt Engineering     Collaborator  ████████████░░░░
  📎 Context Engineering    Explorer      ████████░░░░░░░░
  🤖 Agentic                Collaborator  ████████████░░░░
  🔧 Tool Usage             Strategist    ████████████████
  ⚙️  Customization          Explorer      ████████░░░░░░░░
  🔄 Workflow Integration   Collaborator  ████████████░░░░

Run with --tips to see how to advance each category.
```

---

### `diagnostics` — Search Locations & Stats

Show all locations searched for session files, whether each path exists, and per-location stats.

```bash
ai-engineering-fluency diagnostics
```

```
GitHub Copilot Token Tracker - Diagnostics
==========================================

Searching for session files...

  ✔  /home/user/.config/Code/User/workspaceStorage          42 files found
  ✔  /home/user/.config/Code/User/globalStorage              3 files found
  ✔  /home/user/.config/Code - Insiders/User/workspaceStorage  8 files found
  ✗  /home/user/.config/Code - Exploration/...              (path does not exist)
  ✔  /home/user/.local/share/opencode                        3 files found
  ✗  /home/user/.config/Cursor/...                          (path does not exist)

Total: 56 files across 3 editors
```

---

### `sessions` — Session List By Day

Show session usage for a UTC day as a per-session list with time, tokens, and estimated cost.

```bash
ai-engineering-fluency sessions
ai-engineering-fluency sessions --date 2026-05-16
ai-engineering-fluency sessions --json
```

Example output:

```
Session Usage (2026-05-16)

  Time         │ Editor           │ Input      │ Output     │ Total      │ Cost (UBB)   │ Session File
  ─────────────────────────────────────────────────────────────────────────────────────────────────────────
  10:22:13 AM  │ vscode           │ 2.1K       │ 4.8K       │ 6.9K       │ $0.0240      │ e7f5....jsonl
  09:14:07 AM  │ copilot-cli      │ 1.0K       │ 2.4K       │ 3.4K       │ $0.0118      │ 43cc....jsonl
```

With `--json`, outputs a machine-readable payload with the selected `date`, per-session rows, totals, and `discoveredFiles`.

---

## Data Sources

The CLI scans the same session files as the [VS Code extension](../vscode-extension/README.md):

- **VS Code** (Stable, Insiders, Exploration) workspace and global storage
- **VSCodium** and **Cursor** editor sessions
- **VS Code Remote** / Codespaces sessions
- **Copilot CLI** agent mode sessions
- **OpenCode** sessions (JSON and SQLite)
- **Claude Code** sessions (Anthropic CLI/IDE extension, actual API token counts)
- **Gemini CLI** sessions (JSONL, actual token counts from assistant events)
- **Claude Desktop Cowork** sessions (Windows only, local agent mode sessions with actual API token counts)

---

## Requirements

- Node.js 18 or later
- GitHub Copilot Chat session files on the local machine

---

## Development

```bash
# From the repository root
npm run cli:build           # Build the CLI
npm run cli:stats           # Run stats command
npm run cli:usage           # Run usage command
npm run cli:environmental   # Run environmental command
npm run cli:fluency         # Run fluency command
npm run cli:diagnostics     # Run diagnostics command
npm run cli -- --help       # Run any CLI command
```

---

## License

MIT — see [LICENSE](../../LICENSE) for details.
