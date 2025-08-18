const arrayAsyncForEach = async <T>(
  array: T[],
  predicate: (item: T, itemIndex: number) => Promise<void>,
) => {
  for (let itemIndex = 0; itemIndex < array.length; itemIndex++) {
    await predicate(array[itemIndex], itemIndex)
  }
}

export default arrayAsyncForEach
