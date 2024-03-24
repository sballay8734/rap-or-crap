const colorMap: Record<string, string> = {
  string: "color: #53f769; font-weight: bold;",
  number: "color: #feff00; font-weight: bold;",
  object: "color: #ff00ff; font-weight: bold;",
  boolean: "color: #e06c75; font-weight: bold;",

  undefined: "color: #866345;",
  null: "color: #d19a66; font-weight: bold;",
  bigint: "color: #a9aa00;",

  logPrefix: "color: #00ff00; font-weight: bold;",
  warnPrefix: "color: #ffde56; font-weight: bold;",
  errorPrefix: "color: #ff6269; font-weight: bold;",
  index: "color: #525252",
  end: "color: #43954e; font-weight: bold;",

  function: "color: #808080; font-weight: bold;",
  symbol: "color: #808080; font-weight: bold;"
}

type ArgType = string | number | object | boolean | undefined | null | bigint

export function logClient(...args: ArgType[]) {
  const pre = "%c[LOG]"
  let index = 1
  for (const arg of args) {
    const argType = typeof arg

    const num = `%c${index}.`
    const _arg = `%c${arg}`
    const tc = colorMap.logPrefix
    const numColor = colorMap.index
    const _argColor = colorMap[argType]

    if (arg === null) {
      console.log(`${pre} ${num} ${_arg}`, tc, numColor, colorMap.null)
    } else if (arg === undefined) {
      console.log(`${pre} ${num} ${_arg}`, tc, numColor, colorMap.undefined)
    } else if (typeof arg === "object") {
      console.log(`${pre} ${num}`, tc, numColor, arg)
    } else {
      console.log(`${pre} ${num} ${_arg}`, tc, numColor, _argColor)
    }

    index++
  }
  console.log(
    "%c****************************** END OF LOG ******************************",
    colorMap.end
  )
}

export function warnClient(...args: ArgType[]) {
  const pre = "%c[WARN]"
  let index = 1
  for (const arg of args) {
    const argType = typeof arg

    const num = `%c${index}.`
    const _arg = `%c${arg}`
    const tc = colorMap.warnPrefix
    const numColor = colorMap.index
    const _argColor = colorMap[argType]

    if (arg === null) {
      console.warn(`${pre} ${num} ${_arg}`, tc, numColor, colorMap.null)
    } else if (arg === undefined) {
      console.warn(`${pre} ${num} ${_arg}`, tc, numColor, colorMap.undefined)
    } else if (typeof arg === "object") {
      console.warn(`${pre} ${num}`, tc, numColor, arg)
    } else {
      console.warn(`${pre} ${num} ${_arg}`, tc, numColor, _argColor)
    }

    index++
  }
  console.log(
    "%c****************************** END OF LOG ******************************",
    colorMap.end
  )
}

export function errorClient(...args: ArgType[]) {
  const pre = "%c[ERR]"
  let index = 1
  for (const arg of args) {
    const argType = typeof arg

    const num = `%c${index}.`
    const _arg = `%c${arg}`
    const tc = colorMap.errorPrefix
    const numColor = colorMap.index
    const _argColor = colorMap[argType]

    if (arg === null) {
      console.error(`${pre} ${num} ${_arg}`, tc, numColor, colorMap.null)
    } else if (arg === undefined) {
      console.error(`${pre} ${num} ${_arg}`, tc, numColor, colorMap.undefined)
    } else if (typeof arg === "object") {
      console.error(`${pre} ${num}`, tc, numColor, arg)
    } else {
      console.error(`${pre} ${num} ${_arg}`, tc, numColor, _argColor)
    }

    index++
  }
  console.log(
    "%c****************************** END OF LOG ******************************",
    colorMap.end
  )
}
