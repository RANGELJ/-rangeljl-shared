import waitMilliseconds from './waitMilliseconds'

const asyncFunctionWithMinTime = async <T>(
  minTimeInMillis: number,
  callback: () => Promise<T>,
) => {
  const startAt = new Date().getTime()
  const result = await callback()
  const endAt = new Date().getTime()
  const millisItTook = endAt - startAt
  const remainingMillis = minTimeInMillis - millisItTook
  if (remainingMillis > 0) {
    await waitMilliseconds(remainingMillis)
  }
  return result
}

export default asyncFunctionWithMinTime
