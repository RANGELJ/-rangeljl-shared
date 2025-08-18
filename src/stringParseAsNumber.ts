const stringParseAsNumber = (str: string) => {
  if (!str) {
    throw new Error(`Failed to parse "${str}" as number`)
  }
  const parsed = Number(str)
  if (Number.isNaN(parsed)) {
    throw new Error(`Failed to parse "${str}" as number`)
  }
  return parsed
}

export default stringParseAsNumber
