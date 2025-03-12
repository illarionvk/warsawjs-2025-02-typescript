// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import { baseConfigs } from './devops/lint/base-rules.mjs'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  ...baseConfigs,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/await-thenable': ['warn'],
      '@typescript-eslint/explicit-module-boundary-types': ['warn'],
      '@typescript-eslint/no-unnecessary-condition': ['warn'],
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': ['off'],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } }
      ],
      '@typescript-eslint/prefer-nullish-coalescing': ['warn'],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowAny: false,
          allowBoolean: false,
          allowNullish: true,
          allowNumber: true,
          allowRegExp: false,
          allowNever: false
        }
      ],
      '@typescript-eslint/require-await': ['warn'],
      'require-await': ['off']
    }
  }
)
