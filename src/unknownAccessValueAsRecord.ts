import unknownIsArray from './unknownIsArray'
import unknownIsRecord from './unknownIsRecord'
import unkownIsNumber from './unknownIsNumber'

const unknownAccessValueAsRecord = (
  original: unknown,
  path: (string | number)[],
): unknown => {
  if (path.length < 1) {
    throw new Error('At least one path is necessary to access as record')
  }

  const [currentProp, ...restOfProps] = path

  if (unknownIsRecord(original)) {
    if (restOfProps.length < 1) {
      return original[currentProp]
    }
    return unknownAccessValueAsRecord(original[currentProp], restOfProps)
  } else if (unknownIsArray(original) && unkownIsNumber(currentProp)) {
    if (restOfProps.length < 1) {
      return original[currentProp]
    }
    return unknownAccessValueAsRecord(original[currentProp], restOfProps)
  }
  return undefined
}

export default unknownAccessValueAsRecord
