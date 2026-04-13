import { AsyncLocalStorage } from 'async_hooks';
import type { IncomingHttpHeaders } from 'http';

export const requestHeadersContext = new AsyncLocalStorage<IncomingHttpHeaders>();
