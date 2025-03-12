/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-unnecessary-type-parameters, @typescript-eslint/no-empty-function */

/**
 * Let Typescript evaluate the types in the function, but don't run the function
 */
export const doNotRun = <F extends () => unknown>(_: F): void => {}

export type Expect<T extends true> = T
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false
