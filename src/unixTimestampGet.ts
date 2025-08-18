import millisecondsTimestampToUnix from './millisecondsTimestampToUnix'

const unixTimestampGet = () => millisecondsTimestampToUnix(Date.now())

export default unixTimestampGet
