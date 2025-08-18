const waitMilliseconds = (miliseconds: number) =>
  new Promise(resolve => setTimeout(resolve, miliseconds))

export default waitMilliseconds
