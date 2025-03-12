import test from 'ava'
import { unreachable } from './unreachable.js'

test('given exhaustive ternary expression', (t) => {
  const infer = (input: 'a' | 'b'): 'x' | 'y' | null => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return input === 'a' ? 'x' : input === 'b' ? 'y' : unreachable(input, null)
  }

  t.is(infer('a'), 'x')
  t.is(infer('b'), 'y')
})

test('given non-exhaustive ternary expression', (t) => {
  const infer = (input: 'a' | 'b'): 'x' | 'y' | null => {
    // @ts-expect-error The expression is not exhaustive
    return input === 'a' ? 'x' : unreachable(input, null)
  }

  t.is(infer('a'), 'x')
  t.is(infer('b'), null)

  // @ts-expect-error This is a runtime test for the fallback
  t.is(infer('c'), null)
})
