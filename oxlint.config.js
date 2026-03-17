import { defineConfig } from 'oxlint';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';

export default defineConfig({
  globalIgnores: [
    'dist',
    'node_modules',
    '.next',
    'coverage',
    '**/*.d.ts',
    '**/*.config.*',
    'vite.config.ts',
    'tsconfig.json',
  ],
  plugins: [
    'react',
    'typescript',
    'unicorn',
  ],
  rules: {
    'no-debugger': 'error',
    'no-console': 'warn',
    'typescript/no-explicit-any': 'error',
    'no-relative-import-paths/no-relative-import-paths': 'error',
  },
  // Use ESLint plugin via jsPlugins
  jsPlugins: [
    noRelativeImportPaths,
  ],
  // Override settings for specific paths
  overrides: [
    {
      files: ['server/src/**/*.ts'],
      settings: {},
    },
    {
      files: ['client/src/**/*.tsx', 'client/src/**/*.ts'],
      plugins: ['react'],
      settings: {},
    },
  ],
});
