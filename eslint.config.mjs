// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import { baseConfigs } from './devops/lint/base-rules.mjs'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  ...baseConfigs
)
