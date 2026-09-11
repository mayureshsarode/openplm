// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Allow unused vars prefixed with _ (conventional ignore pattern)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Require explicit return types on public functions
      '@typescript-eslint/explicit-function-return-type': 'off',
      // Allow require() in config files
      '@typescript-eslint/no-require-imports': 'error',
    },
  },
  {
    // Ignore compiled output and node_modules
    ignores: ['dist/**', 'node_modules/**'],
  },
);
