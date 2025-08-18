const classNamesMerge = (...classNames: (string | undefined)[]) =>
  classNames.filter(className => !!className).join(' ')

export default classNamesMerge
