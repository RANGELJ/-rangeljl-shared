import waitMilliseconds from './waitMilliseconds'

type Args<FuncArgs extends unknown[], Return> = {
  delayInMillis: number
  func: (...args: FuncArgs) => Promise<Return>
}

const queuedAsyncFunction = <FuncArgs extends unknown[], Return>({
  delayInMillis,
  func,
}: Args<FuncArgs, Return>) => {
  type QueuedFunc = () => Promise<void>

  const queue: QueuedFunc[] = []

  let runningFunctions = false

  const runQueue = async () => {
    if (runningFunctions) {
      return
    }
    runningFunctions = true

    do {
      const queuedFunc = queue.shift()
      if (queuedFunc) {
        await queuedFunc()
        if (delayInMillis > 0) {
          await waitMilliseconds(delayInMillis)
        }
      }
    } while (queue.length > 0)

    runningFunctions = false
  }

  return (...args: FuncArgs) =>
    new Promise<Return>((resolve, reject) => {
      const funcToQued = async () => {
        try {
          const returnValue = await func(...args)
          resolve(returnValue)
        } catch (error) {
          reject(error)
        }
      }
      queue.push(funcToQued)
      runQueue()
    })
}

export default queuedAsyncFunction
