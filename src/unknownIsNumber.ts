const unknownIsNumber = (value: unknown): value is number =>
  typeof value === 'number' && !Number.isNaN(value)

export default unknownIsNumber
