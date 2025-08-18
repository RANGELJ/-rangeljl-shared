const unknownIsRecord = (
  value: unknown,
): value is Record<string | number, unknown> =>
  typeof value === 'object' && value !== null

export default unknownIsRecord
