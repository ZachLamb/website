import { createRequire } from 'node:module';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';

// eslint-plugin-react's `version: 'detect'` calls context.getFilename(), which
// ESLint 10 removed, so the installed React version is read here instead.
const reactVersion = createRequire(import.meta.url)('react/package.json').version;

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      '@next/next': nextPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...hooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    settings: {
      react: { version: reactVersion },
    },
  },
  {
    // Test files often need `any` to stub opaque third-party APIs
    // (e.g., framer-motion proxy mocks where typing each motion.* helper
    // is more noise than signal). Disable the rule for tests only.
    files: ['**/*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', '.claude/worktrees/**'],
  },
];
