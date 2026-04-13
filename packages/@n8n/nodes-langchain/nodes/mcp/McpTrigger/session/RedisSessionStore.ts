import type { Tool } from '@langchain/core/tools';
import type { IncomingHttpHeaders } from 'http';

import type { SessionStore } from './SessionStore';

export interface RedisPublisher {
	set(key: string, value: string, ttl: number): Promise<void>;
	get(key: string): Promise<string | null>;
	clear(key: string): Promise<void>;
}

export class RedisSessionStore implements SessionStore {
	private tools: Record<string, Tool[]> = {};

	private headers: Record<string, IncomingHttpHeaders> = {};

	constructor(
		private publisher: RedisPublisher,
		private getSessionKey: (sessionId: string) => string,
		private ttl: number,
	) {}

	async register(sessionId: string): Promise<void> {
		await this.publisher.set(this.getSessionKey(sessionId), '1', this.ttl);
	}

	async validate(sessionId: string): Promise<boolean> {
		const result = await this.publisher.get(this.getSessionKey(sessionId));
		return result !== null;
	}

	async unregister(sessionId: string): Promise<void> {
		await this.publisher.clear(this.getSessionKey(sessionId));
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
