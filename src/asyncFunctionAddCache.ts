import unixTimestampGet from './unixTimestampGet'

type Args<OriginalArgs, ReturnValue> = {
  originalFunction: (args: OriginalArgs) => Promise<ReturnValue>
  hashArgs: (args: OriginalArgs) => string
  expirationTimeInSeconds?: number
  debugName?: string
}

/**
 * Creates a function that caches to RAM the value given
 * @param param0
 * @returns
 */
const asyncFunctionAddCache = <OriginalArgs, ReturnValue>({
  hashArgs,
  originalFunction,
  expirationTimeInSeconds = Infinity,
  debugName,
}: Args<OriginalArgs, ReturnValue>) => {
  type CacheRecord = {
    value: ReturnValue
    timestamp: number
  }

  let cache: Record<string, CacheRecord | undefined> = {}

  const functionWithCache = async (
    args: OriginalArgs,
    isRetry?: true,
  ): Promise<ReturnValue> => {
    const argsHash = hashArgs(args)
    const cachedRecord = cache[argsHash]

    if (cachedRecord) {
      const secondsSinceCache = unixTimestampGet() - cachedRecord.timestamp

      if (secondsSinceCache < expirationTimeInSeconds) {
        if (debugName) {
          console.log(`[${debugName}] Cache hit`)
        }
        return cachedRecord.value
      }
    }

    if (debugName) {
      console.log(`[${debugName}] Cache miss`)
    }

    try {
      const value = await originalFunction(args)

      cache[argsHash] = {
        value,
        timestamp: unixTimestampGet(),
      }

      return value
    } catch (error) {
      if (isRetry) {
        throw error
      }
      cache[argsHash] = undefined
      return functionWithCache(args, true)
    }
  }

  functionWithCache.getCache = () => cache
  functionWithCache.clearCacheRecord = (args: OriginalArgs) => {
    delete cache[hashArgs(args)]
  }
  functionWithCache.cacheClear = () => {
    cache = {}
  }

  return functionWithCache
}

export default asyncFunctionAddCache
