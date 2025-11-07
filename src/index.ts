export * from './core';
export * from './geometry';
export * from './utils';

const env = process?.env?.NODE_ENV;

export const __DEV__ = env !== 'production';
