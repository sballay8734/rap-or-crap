const colorMap: Record<string, string> = {
  string: "\x1b[1;92m", // Bright Green
  number: "\x1b[1;93m", // Bright Yellow
  boolean: "\x1b[1;94m", // Bright Blue
  object: "\x1b[95m", // Bright Pink
  null: "\x1b[1;91m",
  undefined: "\x1b[90m",

  bigint: "\x1b[90m",

  logPrefix: "\x1b[30;42m[LOG]",
  warnPrefix: "\x1b[30;43m[WARN]",
  errorPrefix: "\x1b[30;41m[ERR]",
  logBg: "\x1b[30;42m",
  warnBg: "\x1b[30;43m",
  errorBg: "\x1b[30;41m",
  end: "\x1b[0m"
}

type ArgType =
  | string
  | number
  | object
  | boolean
  | undefined
  | null
  | bigint
  | unknown

function formatPrefix(prefix: string) {
  return `${prefix}${colorMap.end}`
}

function formatIndex(index: number) {
  return `${colorMap.bigint}${index}.${colorMap.end}`
}

function formatArg(arg: ArgType) {
  const argType = typeof arg
  if (arg === null) {
    return `${colorMap.null}${arg}${colorMap.end}`
  }

  if (argType === "object") {
    return arg
  }

  return `${colorMap[argType]}${arg}${colorMap.end}`
}

function formatLog(prefix: string, index: number, arg: ArgType) {
  console.log(formatPrefix(prefix), formatIndex(index), formatArg(arg))
}

function formatLogNoBg(index: number, arg: ArgType) {
  console.log(formatIndex(index), formatArg(arg))
}

export function logServer(...args: ArgType[]) {
  const pre = colorMap.logPrefix
  let index = 1
  for (const arg of args) {
    if (arg === null) {
      if (args.length < 2) {
        formatLogNoBg(index, arg)
      } else {
        formatLog(pre, index, arg)
      }
    } else if (arg === undefined) {
      if (args.length < 2) {
        formatLogNoBg(index, arg)
      } else {
        formatLog(pre, index, arg)
      }
    } else if (typeof arg === "object") {
      if (args.length < 2) {
        formatLogNoBg(index, arg)
      } else {
        formatLog(pre, index, arg)
      }
    } else {
      if (args.length < 2) {
        formatLogNoBg(index, arg)
      } else {
        formatLog(pre, index, arg)
      }
    }

    index++
  }

  if (args.length < 2) {
    console.log("")
    return
  }

  console.log(
    `${colorMap.logBg}************************************* END OF LOG *************************************${colorMap.end}\n\n`
  )
}

export function warnServer(...args: ArgType[]) {
  const pre = colorMap.warnPrefix
  let index = 1
  for (const arg of args) {
    if (arg === null) {
      formatLog(pre, index, arg)
    } else if (arg === undefined) {
      formatLog(pre, index, arg)
    } else if (typeof arg === "object") {
      formatLog(pre, index, arg)
    } else {
      formatLog(pre, index, arg)
    }

    index++
  }
  console.log(
    `${colorMap.warnBg}************************************* END OF LOG *************************************${colorMap.end}\n\n`
  )
}

export function errorServer(...args: ArgType[]) {
  const pre = colorMap.errorPrefix
  let index = 1
  for (const arg of args) {
    if (arg === null) {
      formatLog(pre, index, arg)
    } else if (arg === undefined) {
      formatLog(pre, index, arg)
    } else if (typeof arg === "object") {
      formatLog(pre, index, arg)
    } else {
      formatLog(pre, index, arg)
    }

    index++
  }
  console.log(
    `${colorMap.errorBg}************************************* END OF LOG *************************************${colorMap.end}\n\n`
  )
}
