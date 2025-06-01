import { eslint } from '@eslint/eslintrc';

export default eslint.config({
  extends: ['next/core-web-vitals'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-this-alias': 'off',
    'react-hooks/exhaustive-deps': 'warn'
  }
});
