import stringParseAsNumber from './stringParseAsNumber'

const stringParseAsNumberOrDefault = <T>(value: string, defaultValue: T) => {
  try {
    const parsed = stringParseAsNumber(value)
    return parsed
  } catch {
    return defaultValue
  }
}

export default stringParseAsNumberOrDefault
