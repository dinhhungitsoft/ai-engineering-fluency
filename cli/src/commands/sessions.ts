/**
 * `sessions` command - List today's session-level token usage.
 */
import { Command } from 'commander';
import chalk from 'chalk';
import * as path from 'path';
import { fmt, formatTokens } from '../helpers';
import { getSessionsReport } from '../api';

function truncateName(filePath: string, maxLength = 28): string {
	const name = path.basename(filePath);
	if (name.length <= maxLength) { return name; }
	return name.slice(0, maxLength - 1) + '…';
}

function printTable(headers: string[], rows: string[][], colWidths: number[]): void {
	const separator = chalk.dim('─'.repeat(colWidths.reduce((sum, width) => sum + width + 3, -1)));
	const headerLine = headers.map((header, i) => chalk.bold(header.padEnd(colWidths[i]))).join(' │ ');

	console.log('  ' + headerLine);
	console.log('  ' + separator);

	for (const row of rows) {
		const line = row.map((cell, i) => cell.padEnd(colWidths[i])).join(chalk.dim(' │ '));
		console.log('  ' + line);
	}

	console.log('  ' + separator);
}

export const sessionsCommand = new Command('sessions')
	.description('List session usage for a UTC day (time, tokens, and estimated cost)')
	.option('--date <date>', 'UTC date to query in YYYY-MM-DD format')
	.option('--json', 'Output raw JSON (for machine consumption)')
	.action(async (options) => {
		let report;
		try {
			report = await getSessionsReport({ date: options.date });
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to build sessions report.';
			console.error(chalk.red(message));
			process.exitCode = 1;
			return;
		}

		if (options.json) {
			process.stdout.write(JSON.stringify(report));
			return;
		}

		if (report.discoveredFiles === 0) {
			console.log(chalk.yellow('⚠️  No session files found.'));
			return;
		}

		console.log(chalk.bold.cyan(`\n🧾 Session Usage (${report.date})\n`));

		if (report.sessions.length === 0) {
			console.log(chalk.dim(`No sessions found for ${report.date}.\n`));
			return;
		}

		const rows = report.sessions.map((session) => {
			const localTime = new Date(session.time).toLocaleTimeString();
			const modelsStr = session.models.length > 0 ? session.models.join(', ') : '—';
			return [
				localTime,
				session.editor,
				formatTokens(session.inputTokens),
				formatTokens(session.outputTokens),
				formatTokens(session.totalTokens),
				'$' + session.estimatedCostCopilot.toFixed(4),
				modelsStr,
				truncateName(session.file),
			];
		});

		printTable(
			['Time', 'Editor', 'Input', 'Output', 'Total', 'Cost (UBB)', 'Models', 'Session File'],
			rows,
			[12, 16, 10, 10, 10, 12, 28, 28]
		);

		console.log();
		console.log(`  Sessions: ${chalk.bold(fmt(report.totals.sessions))}`);
		console.log(`  Input:    ${chalk.bold(formatTokens(report.totals.inputTokens))}`);
		console.log(`  Output:   ${chalk.bold(formatTokens(report.totals.outputTokens))}`);
		console.log(`  Total:    ${chalk.bold.yellow(formatTokens(report.totals.totalTokens))}`);
		console.log(`  Cost:     ${chalk.green('$' + report.totals.estimatedCostCopilot.toFixed(4))} ${chalk.dim('(Copilot AI Credits)')}`);
		console.log();
	});
