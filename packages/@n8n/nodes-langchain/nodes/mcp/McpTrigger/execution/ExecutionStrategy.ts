import type { Tool } from '@langchain/core/tools';
import type { IncomingHttpHeaders } from 'http';

export interface ExecutionContext {
	sessionId: string;
	messageId?: string;
	requestHeaders?: IncomingHttpHeaders;
}

export interface ExecutionStrategy {
	executeTool(
		tool: Tool,
		args: Record<string, unknown>,
		context: ExecutionContext,
	): Promise<unknown>;
}
