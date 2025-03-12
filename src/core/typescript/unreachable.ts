/**
 * Marks a code block as unreachable.
 *
 * @param testValue - The value that is expected to be unreachable.
 * @param returnValue - The value to be returned when the testValue is unreachable.
 * @returns The specified returnValue.
 */
export const unreachable = <R>(testValue: never, returnValue: R): R => {
  testValue satisfies never
  return returnValue
}
