import type { Tool } from '@langchain/core/tools';

import type { ExecutionContext, ExecutionStrategy } from './ExecutionStrategy';
import { requestHeadersContext } from './requestHeadersContext';

export class DirectExecutionStrategy implements ExecutionStrategy {
	async executeTool(
		tool: Tool,
		args: Record<string, unknown>,
		context: ExecutionContext,
	): Promise<unknown> {
		if (context.requestHeaders) {
			const argsWithHeaders = { ...args, __n8nMcpHeaders: context.requestHeaders };
			return await requestHeadersContext.run(context.requestHeaders, async () =>
				tool.invoke(argsWithHeaders),
			);
		}
		return await tool.invoke(args);
	}
}
