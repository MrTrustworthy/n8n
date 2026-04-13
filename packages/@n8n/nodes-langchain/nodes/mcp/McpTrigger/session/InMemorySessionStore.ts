import type { Tool } from '@langchain/core/tools';
import type { IncomingHttpHeaders } from 'http';

import type { SessionStore } from './SessionStore';

export class InMemorySessionStore implements SessionStore {
	private sessions = new Set<string>();

	private tools: Record<string, Tool[]> = {};

	private headers: Record<string, IncomingHttpHeaders> = {};

	// eslint-disable-next-line @typescript-eslint/require-await
	async register(sessionId: string): Promise<void> {
		this.sessions.add(sessionId);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async validate(sessionId: string): Promise<boolean> {
		return this.sessions.has(sessionId);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async unregister(sessionId: string): Promise<void> {
		this.sessions.delete(sessionId);
		delete this.tools[sessionId];
		delete this.headers[sessionId];
	}

	getTools(sessionId: string): Tool[] | undefined {
		return this.tools[sessionId];
	}

	setTools(sessionId: string, tools: Tool[]): void {
		this.tools[sessionId] = tools;
	}

	clearTools(sessionId: string): void {
		delete this.tools[sessionId];
	}

	getHeaders(sessionId: string): IncomingHttpHeaders | undefined {
		return this.headers[sessionId];
	}

	setHeaders(sessionId: string, headers: IncomingHttpHeaders): void {
		this.headers[sessionId] = headers;
	}
}
