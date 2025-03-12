import test from 'ava'
import { type JSONValue } from '../json-value.js'
import { type Equal, doNotRun } from '../test-assertions'

test(`given JSON network response`, (t) => {
  doNotRun(async () => {
    const result = await fetch('/cart.json').then((res) => res.json())

    true satisfies Equal<typeof result, JSONValue>

    return result
  })
  t.pass()
})

test(`given an attempt to add a generic parameter for json()`, (t) => {
  doNotRun(async () => {
    await fetch('/cart.json').then((res) => {
      // @ts-expect-error Safety measure in case someone tries to introduce json<T> generic
      return res.json<{ id: number }>()
    })
  })
  t.pass()
})
