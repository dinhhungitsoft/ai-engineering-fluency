# Copilot Token Tracker CLI

![AI Engineering Fluency](../assets/AI%20Engineering%20Fluency%20-%20Transparent.png)

> For user-facing documentation and command examples, see [docs/cli/README.md](../docs/cli/README.md).

📦 **npm**: [@rajbos/ai-engineering-fluency](https://www.npmjs.com/package/@rajbos/ai-engineering-fluency)

## Development

```bash
# From the repository root
npm run cli:build           # Build the CLI
npm run cli:stats           # Run stats command
npm run cli:usage           # Run usage command
npm run cli:environmental   # Run environmental command
npm run cli:fluency         # Run fluency command
npm run cli:diagnostics     # Run diagnostics command
npm run cli -- sessions      # Run session usage report for today
npm run cli -- sessions --date 2026-05-16
npm run cli -- --help       # Run any CLI command
npm run cli -- segment      # Output compact token string for oh-my-posh
```

## Package Usage

The npm package can also be imported from another Node.js app:

```ts
import { getSessionsReport } from '@rajbos/ai-engineering-fluency';

const report = await getSessionsReport({ date: '2026-05-16' });
console.log(report.totals.totalTokens, report.sessions.length);
```

The exported API reads the same local session files as the CLI and returns the same payload shape as `sessions --json`.

### oh-my-posh segment

The `segment` command outputs a compact token usage string designed for use in shell prompts.
See [`../omp-segment/README.md`](../omp-segment/README.md) for full setup instructions.

```bash
node dist/cli.js segment            # Use 15-minute cache (default)
node dist/cli.js segment --refresh  # Force refresh, bypass cache
node dist/cli.js segment --hide-zero  # Output nothing when both counts are zero
```

## Requirements

- Node.js 18 or later
- GitHub Copilot Chat session files on the local machine

## Data Sources

The CLI reads the same local session sources as the extension, including:

- GitHub Copilot Chat / Copilot CLI sessions
- OpenCode, Claude Code, and Gemini CLI sessions
- Other supported editor integrations wired through the shared adapter pipeline

## License

MIT — see [LICENSE](../LICENSE) for details.
