import test from 'ava'
import { entries } from './entries.js'
import type { Equal } from './test-assertions.js'

test(`should return an array of typed key/values`, (t) => {
  const input = { a: 1, b: '2', c: null }
  const actual = entries(input)
  const expected = [
    ['a', 1],
    ['b', '2'],
    ['c', null]
  ]

  t.deepEqual(actual, expected)

  true satisfies Equal<
    typeof actual,
    ['a' | 'b' | 'c', string | number | null][]
  >
})
