import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/setup-vitest.ts'],
  },
  resolve: {
    alias: {
      app: resolve(__dirname, 'src/app'),
      '@app': resolve(__dirname, 'src/app'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@core': resolve(__dirname, 'src/app/core'),
      '@env': resolve(__dirname, 'src/environments/environment.ts'),
      '@src': resolve(__dirname, 'src/src'),
      '@state': resolve(__dirname, 'src/app/state'),
      'fast-bitset': resolve(__dirname, 'src/app/util/bitset.ts'),
    },
  },
});
