const cMap: Record<string, string> = {
  string: "color: #53f769; font-weight: bold;",
  number: "color: #feff00; font-weight: bold;",
  object: "color: #ff00ff; font-weight: bold;",
  boolean: "color: #e06c75; font-weight: bold;",

  undefined: "color: #866345;",
  null: "color: #d19a66; font-weight: bold;",
  bigint: "color: #a9aa00;",

  logPrefix: "color: #00ff00; font-weight: bold; background-color: green;",
  warnPrefix: "color: #f8ff00; font-weight: bold; background-color: #5a5c00;",
  errorPrefix: "color: #540706; font-weight: bold; background-color: #ff4f4f",
  index: "color: #525252",
  endLog: "color: #00ff00; font-weight: bold; background-color: green;",
  endWarn: "color: #f8ff00; font-weight: bold; background-color: #5a5c00;",
  endError: "color: #540706; font-weight: bold; background-color: #ff4f4f",

  function: "color: #808080; font-weight: bold;",
  symbol: "color: #808080; font-weight: bold;"
}

type ArgType = string | number | object | boolean | undefined | null | bigint

function handleSingleArg(arg: ArgType, origin: "log" | "warn" | "error") {
  const spacer = "%c "
  const argType = typeof arg

  const styl =
    origin === "log"
      ? cMap.logPrefix
      : origin === "warn"
      ? cMap.warnPrefix
      : cMap.errorPrefix

  const pre =
    origin === "log" ? "%c[LOG]" : origin === "warn" ? "%c[WARN]" : "%c[ERR]"

  const end =
    origin === "log"
      ? cMap.endLog
      : origin === "warn"
      ? cMap.endWarn
      : cMap.endError

  if (arg === null) {
    console.log(`${pre}${spacer}${arg}`, styl, "", cMap.null)
  } else if (arg === undefined) {
    console.log(`${pre}${spacer}${arg}`, styl, "", cMap.undefined)
  } else if (typeof arg === "object") {
    console.log(`${pre}${spacer}`, styl, "", arg)
  } else {
    console.log(`${pre}${spacer}${arg}`, styl, "", cMap[argType])
  }

  console.log(
    "%c****************************** END OF LOG ******************************",
    end,
    "\n\n\n\n"
  )
}

// ! Should really see if there is a way to see where the log came from instead of "logFormatter"

// ! Remove prefix bg if args.length < 2

// ! Need to finish WARN and ERR calls

// ! Need to add space at the end of single logs

export function logClient(...args: ArgType[]) {
  const pre = "%c[LOG]"
  let index = 1
  for (const arg of args) {
    const argType = typeof arg

    if (args.length < 2) {
      handleSingleArg(arg, "log")
      return
    }

    const num = `%c${index}.`
    const _arg = `%c${arg}`
    const tc = cMap.logPrefix
    const numColor = cMap.index
    const _argColor = cMap[argType]
    const spacer = "%c "

    if (arg === null) {
      console.log(`${pre}${spacer}${num} ${_arg}`, tc, "", numColor, cMap.null)
    } else if (arg === undefined) {
      console.log(
        `${pre}${spacer}${num} ${_arg}`,
        tc,
        "",
        numColor,
        cMap.undefined
      )
    } else if (typeof arg === "object") {
      console.log(`${pre}${spacer}${num}`, tc, "", numColor, arg)
    } else {
      console.log(`${pre}${spacer}${num} ${_arg}`, tc, "", numColor, _argColor)
    }

    index++
  }

  if (args.length < 2) {
    return
  }

  console.log(
    "%c****************************** END OF LOG ******************************",
    cMap.endLog,
    "\n\n\n\n"
  )
}

export function warnClient(...args: ArgType[]) {
  const pre = "%c[WARN]"
  let index = 1
  for (const arg of args) {
    const argType = typeof arg

    const num = `%c${index}.`
    const _arg = `%c${arg}`
    const tc = cMap.warnPrefix
    const numColor = cMap.index
    const _argColor = cMap[argType]
    const spacer = "%c "

    if (arg === null) {
      console.warn(`${pre}${spacer}${num} ${_arg}`, tc, "", numColor, cMap.null)
    } else if (arg === undefined) {
      console.warn(
        `${pre}${spacer}${num} ${_arg}`,
        tc,
        "",
        numColor,
        cMap.undefined
      )
    } else if (typeof arg === "object") {
      console.warn(`${pre}${spacer}${num}`, tc, "", numColor, arg)
    } else {
      console.warn(`${pre}${spacer}${num} ${_arg}`, tc, "", numColor, _argColor)
    }

    index++
  }

  if (args.length < 2) {
    return
  }

  console.log(
    "%c****************************** END OF LOG ******************************",
    cMap.endWarn,
    "\n\n\n\n"
  )
}

export function errorClient(...args: ArgType[]) {
  const pre = "%c[ERR]"
  let index = 1
  for (const arg of args) {
    const argType = typeof arg

    const num = `%c${index}.`
    const _arg = `%c${arg}`
    const tc = cMap.errorPrefix
    const numColor = cMap.index
    const _argColor = cMap[argType]
    const spacer = "%c "

    if (arg === null) {
      console.error(
        `${pre}${spacer}${num} ${_arg}`,
        tc,
        "",
        numColor,
        cMap.null
      )
    } else if (arg === undefined) {
      console.error(
        `${pre}${spacer}${num} ${_arg}`,
        tc,
        "",
        numColor,
        cMap.undefined
      )
    } else if (typeof arg === "object") {
      console.error(`${pre}${spacer}${num}`, tc, "", numColor, arg)
    } else {
      console.error(
        `${pre}${spacer}${num} ${_arg}`,
        tc,
        "",
        numColor,
        _argColor
      )
    }

    index++
  }

  if (args.length < 2) {
    return
  }

  console.log(
    "%c****************************** END OF LOG ******************************",
    cMap.endError,
    "\n\n\n\n"
  )
}
