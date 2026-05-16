import { calculateTodaySessionUsage, discoverSessionFiles, loadCache, saveCache } from './helpers';
import type { SessionUsageEntry } from './helpers';

export interface SessionsReportTotals {
	sessions: number;
	inputTokens: number;
	outputTokens: number;
	totalTokens: number;
	estimatedCost: number;
	estimatedCostCopilot: number;
}

export interface SessionsReport {
	date: string;
	discoveredFiles: number;
	sessions: SessionUsageEntry[];
	totals: SessionsReportTotals;
	lastUpdated: string;
	backendConfigured: boolean;
}

export interface GetSessionsReportOptions {
	date?: string | Date;
	sessionFiles?: string[];
}

function normalizeDateKey(date?: string | Date): string {
	if (date === undefined) {
		return new Date().toISOString().slice(0, 10);
	}

	if (date instanceof Date) {
		if (Number.isNaN(date.getTime())) {
			throw new RangeError('Invalid date. Expected a valid Date or YYYY-MM-DD string.');
		}
		return date.toISOString().slice(0, 10);
	}

	const trimmed = date.trim();
	if (!trimmed) {
		throw new RangeError('Invalid date. Expected a non-empty YYYY-MM-DD string.');
	}

	if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
		const parsed = new Date(`${trimmed}T00:00:00.000Z`);
		if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== trimmed) {
			throw new RangeError('Invalid date. Expected a real calendar date in YYYY-MM-DD format.');
		}
		return trimmed;
	}

	const parsed = new Date(trimmed);
	if (Number.isNaN(parsed.getTime())) {
		throw new RangeError('Invalid date. Expected a valid Date or YYYY-MM-DD string.');
	}

	return parsed.toISOString().slice(0, 10);
}

function buildTotals(sessions: SessionUsageEntry[]): SessionsReportTotals {
	return {
		sessions: sessions.length,
		inputTokens: sessions.reduce((sum, session) => sum + session.inputTokens, 0),
		outputTokens: sessions.reduce((sum, session) => sum + session.outputTokens, 0),
		totalTokens: sessions.reduce((sum, session) => sum + session.totalTokens, 0),
		estimatedCost: sessions.reduce((sum, session) => sum + session.estimatedCost, 0),
		estimatedCostCopilot: sessions.reduce((sum, session) => sum + session.estimatedCostCopilot, 0),
	};
}

export async function getSessionsReport(options: GetSessionsReportOptions = {}): Promise<SessionsReport> {
	const date = normalizeDateKey(options.date);
	loadCache();

	try {
		const sessionFiles = options.sessionFiles ?? await discoverSessionFiles();
		const sessions = sessionFiles.length > 0 ? await calculateTodaySessionUsage(sessionFiles, date) : [];

		return {
			date,
			discoveredFiles: sessionFiles.length,
			sessions,
			totals: buildTotals(sessions),
			lastUpdated: new Date().toISOString(),
			backendConfigured: false,
		};
	} finally {
		saveCache();
	}
}

export type { SessionUsageEntry };