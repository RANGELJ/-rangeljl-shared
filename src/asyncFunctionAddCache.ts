import unixTimestampGet from './unixTimestampGet'

type Args<OriginalArgs, ReturnValue> = {
  originalFunction: (args: OriginalArgs) => Promise<ReturnValue>
  hashArgs: (args: OriginalArgs) => string
  expirationTimeInSeconds?: number
  debugName?: string
}

/**
 * Creates a cached version of an async function that stores results in RAM for improved performance.
 * The cached function includes additional methods for cache management.
 *
 * @template OriginalArgs - The type of arguments the original function accepts
 * @template ReturnValue - The type of value the original function returns
 * @param config - Configuration object for the cache
 * @param config.originalFunction - The async function to be cached
 * @param config.hashArgs - Function that converts arguments to a string hash for caching
 * @param config.expirationTimeInSeconds - Cache expiration time in seconds (default: Infinity)
 * @param config.debugName - Optional name for debug logging
 * @returns A cached version of the original function with additional cache management methods
 *
 * @example
 * ```typescript
 * const cachedFetch = asyncFunctionAddCache({
 *   originalFunction: fetchUserData,
 *   hashArgs: (userId) => `user-${userId}`,
 *   expirationTimeInSeconds: 300, // 5 minutes
 *   debugName: 'UserDataCache'
 * });
 *
 * // Use the cached function
 * const userData = await cachedFetch('123');
 *
 * // Clear specific cache entry
 * cachedFetch.clearCacheRecord('123');
 *
 * // Clear all cache
 * cachedFetch.cacheClear();
 * ```
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

  const cacheMap = new Map<string, CacheRecord | undefined>()

  /**
   * The cached version of the original function. Automatically handles caching logic
   * and cache expiration.
   *
   * @param args - Arguments to pass to the original function
   * @returns Promise that resolves to the cached or freshly computed result
   */
  const functionWithCache = async (
    args: OriginalArgs,
  ): Promise<ReturnValue> => {
    const argsHash = hashArgs(args)
    const cachedRecord = cacheMap.get(argsHash)

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

    const value = await originalFunction(args)

    cacheMap.set(argsHash, {
      value,
      timestamp: unixTimestampGet(),
    })

    return value
  }

  /**
   * Clears a specific cache entry based on the provided arguments.
   *
   * @param args - The arguments used to identify which cache entry to clear
   *
   * @example
   * ```typescript
   * // Clear cache for specific user
   * cachedFunction.clearCacheRecord('user123');
   * ```
   */
  functionWithCache.clearCacheRecord = (args: OriginalArgs) => {
    cacheMap.delete(hashArgs(args))
  }

  /**
   * Removes cache records based on a custom condition function.
   * Useful for selective cache cleanup based on custom criteria.
   *
   * @param conditionFunction - Function that returns true for records that should be REMOVED from cache
   *
   * @example
   * ```typescript
   * // Remove cache entries older than 1 hour
   * cachedFunction.removeCacheRecordsWhere((record) => {
   *   const hourInSeconds = 3600;
   *   return (unixTimestampGet() - record.timestamp) > hourInSeconds;
   * });
   * ```
   */
  functionWithCache.removeCacheRecordsWhere = (
    conditionFunction: (hash: string, record: CacheRecord) => boolean,
  ) => {
    for (const [hash, record] of cacheMap.entries()) {
      if (!record) {
        continue
      }
      if (!conditionFunction(hash, record)) {
        continue
      }
      cacheMap.delete(hash)
    }
  }

  /**
   * Clears all cached entries, completely resetting the cache.
   *
   * @example
   * ```typescript
   * // Clear all cached data
   * cachedFunction.cacheClear();
   * ```
   */
  functionWithCache.cacheClear = () => {
    cacheMap.clear()
  }

  return functionWithCache
}

export default asyncFunctionAddCache
