const valueEnsured = <T>(value: T): NonNullable<T> => {
  if (value === null || value === undefined) {
    throw new Error('Value cannot be null or undefined')
  }
  return value as NonNullable<T>
}

export default valueEnsured
