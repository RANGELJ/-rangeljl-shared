const valueSwitchByKey = <KeyString extends string, Result>(
  key: KeyString,
  options: Record<KeyString, Result>,
) => options[key]

export default valueSwitchByKey
