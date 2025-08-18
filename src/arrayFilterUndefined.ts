const arrayFilterUndefined = <T>(item: T | undefined): item is T =>
  item !== undefined

export default arrayFilterUndefined
