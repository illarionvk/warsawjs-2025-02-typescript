// @ts-check

import reactPlugin from 'eslint-plugin-react'
import * as reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { restrictedGlobals } from './restricted-globals.mjs'

export const baseConfigs = tseslint.config([
  {
    name: 'project-global-ignores',
    ignores: ['devops/lib', 'dist', 'test-out']
  },
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooks.configs['recommended-latest'],
  {
    settings: {
      react: {
        version: '18'
      }
    }
  },
  {
    name: 'project-base',
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser
      }
    },
    rules: {
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'never' }
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/explicit-module-boundary-types': ['off'],
      '@typescript-eslint/no-explicit-any': ['error'],
      '@typescript-eslint/no-inferrable-types': ['off'],
      '@typescript-eslint/no-invalid-void-type': [
        'error',
        { allowAsThisParameter: true }
      ],
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/no-use-before-define': ['error'],
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': ['off'],
      '@typescript-eslint/prefer-ts-expect-error': ['error'],
      curly: ['error'],
      eqeqeq: ['error', 'smart'],
      'func-style': ['error', 'expression'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-irregular-whitespace': ['error', { skipTemplates: true }],
      'no-restricted-globals': ['error', ...restrictedGlobals],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { message: "Please use 'remeda' instead.", name: 'lodash' },
            { message: "Please use 'remeda' instead.", name: 'lodash-es' },
            {
              importNames: ['any'],
              message: "Please use 'unknown()' instead.",
              name: 'superstruct'
            }
          ],
          patterns: [
            { group: ['lodash/*'], message: "Please use 'remeda' instead." }
          ]
        }
      ],
      'no-restricted-properties': [
        'error',
        {
          message: 'Please use `z.unknown()` instead.',
          object: 'z',
          property: 'any'
        }
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'CallExpression[callee.type="MemberExpression"][callee.property.name="querySelector"][typeArguments]',
          message:
            'The querySelector<T> expression is a type assertion in disguse. Please use `core/dom/traversal` instead'
        },
        {
          selector:
            'CallExpression[callee.type="MemberExpression"][callee.property.name="querySelectorAll"][typeArguments]',
          message:
            'The querySelectorAll<T> expression is a type assertion in disguse. Please use `core/dom/traversal` instead'
        }
      ],
      'no-shadow': ['error', { allow: ['cb'] }],
      'no-unused-expressions': ['off'],
      'no-unused-vars': ['off'],
      'no-use-before-define': ['off'],
      'one-var': ['error', 'never'],
      'prefer-promise-reject-errors': ['off'],
      'react-hooks/exhaustive-deps': ['error']
    }
  },
  {
    name: 'project-devops-cjs',
    files: [
      '*.config.cjs',
      '.pnpmfile.cjs',
      'bin/**/*.cjs',
      'devops/**/*.cjs',
      'gulpfile.js'
    ],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      '@typescript-eslint/no-require-imports': ['off']
    }
  }
])
