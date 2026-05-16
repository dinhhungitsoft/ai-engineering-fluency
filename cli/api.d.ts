export interface SessionUsageEntry {
	file: string;
	editor: string;
	time: string;
	inputTokens: number;
	outputTokens: number;
	totalTokens: number;
	interactions: number;
	models: string[];
	estimatedCost: number;
	estimatedCostCopilot: number;
}

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

export declare function getSessionsReport(options?: GetSessionsReportOptions): Promise<SessionsReport>;