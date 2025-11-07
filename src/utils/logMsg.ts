import { __DEV__ } from '../index';

/**
 * Logs a message to the console if in development mode - ignored by c8/vitest coverage.
 * @param message - The message to log.
 */
export function logMsg(message: string): void {
    /* v8 ignore next */
    if (__DEV__) console.warn(message);
}
