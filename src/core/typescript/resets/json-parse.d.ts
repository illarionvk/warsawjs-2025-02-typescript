/**
 * Represents all values serializable to JSON format
 */
type JSONValue =
  | null
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | JSONValue[]

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface JSON {
  /**
   * Converts a JavaScript Object Notation (JSON) string into an object.
   * @param text A valid JSON string.
   * @param reviver A function that transforms the results. This function is called for each member of the object.
   * If a member contains nested objects, the nested objects are transformed before the parent object is.
   */
  parse(
    text: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reviver?: (this: any, key: string, value: any) => any
  ): JSONValue
}
