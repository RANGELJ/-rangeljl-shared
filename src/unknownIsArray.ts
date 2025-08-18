const unknownIsArray = (value: unknown): value is unknown[] =>
  Array.isArray(value)

export default unknownIsArray
