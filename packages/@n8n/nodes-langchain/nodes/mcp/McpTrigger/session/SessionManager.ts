import type { Tool } from '@langchain/core/tools';
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import type { IncomingHttpHeaders } from 'http';

import type { SessionStore } from './SessionStore';
import type { McpTransport } from '../transport/Transport';

export interface SessionInfo {
	sessionId: string;
	server: Server;
	transport: McpTransport;
}

export class SessionManager {
	private sessions: Record<string, SessionInfo> = {};

	constructor(private store: SessionStore) {}

	async registerSession(
		sessionId: string,
		server: Server,
		transport: McpTransport,
		tools?: Tool[],
	): Promise<void> {
		if (!sessionId) return;
		await this.store.register(sessionId);
		this.sessions[sessionId] = { sessionId, server, transport };
		if (tools) {
			this.store.setTools(sessionId, tools);
		}
	}

	async destroySession(sessionId: string): Promise<void> {
		await this.store.unregister(sessionId);
		delete this.sessions[sessionId];
	}

	getSession(sessionId: string): SessionInfo | undefined {
		return this.sessions[sessionId];
	}

	getTransport(sessionId: string): McpTransport | undefined {
		return this.sessions[sessionId]?.transport;
	}

	getServer(sessionId: string): Server | undefined {
		return this.sessions[sessionId]?.server;
	}

	async isSessionValid(sessionId: string): Promise<boolean> {
		return await this.store.validate(sessionId);
	}

	getTools(sessionId: string): Tool[] | undefined {
		return this.store.getTools(sessionId);
	}

	setTools(sessionId: string, tools: Tool[]): void {
		this.store.setTools(sessionId, tools);
	}

	getHeaders(sessionId: string): IncomingHttpHeaders | undefined {
		return this.store.getHeaders(sessionId);
	}

	setHeaders(sessionId: string, headers: IncomingHttpHeaders): void {
		this.store.setHeaders(sessionId, headers);
	}

	setStore(store: SessionStore): void {
		this.store = store;
	}

	getStore(): SessionStore {
		return this.store;
	}
}
