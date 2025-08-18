const unknownIsString = (value: unknown): value is string =>
  typeof value === 'string'

export default unknownIsString
