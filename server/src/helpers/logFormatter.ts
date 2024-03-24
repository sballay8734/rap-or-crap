const colorMap: Record<string, string> = {
  string: "\x1b[1;92m", // Bright Green
  number: "\x1b[1;93m", // Bright Yellow
  boolean: "\x1b[1;94m", // Bright Blue
  object: "\x1b[95m", // Bright Pink
  null: "\x1b[1;91m",
  undefined: "\x1b[90m",

  bigint: "\x1b[90m",

  prefix: "\x1b[30;42m",
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
  return `${colorMap.prefix}${prefix}${colorMap.end}`
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

export default function logServer(...args: ArgType[]) {
  const pre = "[LOG]"
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
    `\n\n\n${colorMap.null}************************************* END OF LOG *************************************${colorMap.end}`
  )
}

// export default function logServer(message?: any, payload?: any) {
//   let logMessage = ""
//   let logPayload = ""

//   const messageType = typeof message
//   const payloadType = typeof payload

//   // * Handle single null case (null as second arg works)
//   if (message === null && payloadType === "undefined") {
//     logPayload = `\x1b[93m${text}\n${typeColorMap.null}${message}${resetColor}\x1b[0m`

//     console.log(logPayload)
//     return
//   }

//   // * Handle double null case
//   if (message === null && payload === null) {
//     logMessage = `\x1b[93m${text}\n${typeColorMap.null}${message}${resetColor}\x1b[0m`
//     logPayload = `\x1b[93m${typeColorMap.null}${payload}${resetColor}\x1b[0m`

//     console.log(logMessage, logPayload)
//     return
//   }

//   // * No arguments provided
//   if (!message && !payload) {
//     logPayload = `\x1b[93m${text}\n${typeColorMap.error}ARGUMENTS TO LOG FUNCTION ARE REQUIRED${resetColor}\x1b[0m`
//     console.log(logPayload)
//     return
//   }

//   // * Don't support symbols
//   if (messageType === "symbol" || payloadType === "symbol") {
//     logPayload = `\x1b[93m${text}\n${typeColorMap.error}Symbols are not supported${resetColor}\x1b[0m`
//     console.log(logPayload)
//     return
//   }

//   // * (_, arg)
//   if (messageType === "undefined" && payloadType !== "undefined") {
//     logPayload =
//       payloadType === "object"
//         ? payload
//         : `\x1b[93m${typeColorMap[payloadType]}${payload}${resetColor}\x1b[0m`

//     console.log(logPayload)
//     return
//   }

//   // * (arg, _)
//   if (messageType !== "undefined" && payloadType === "undefined") {
//     logPayload =
//       messageType === "object"
//         ? message
//         : `\x1b[93m${typeColorMap[messageType]}${message}${resetColor}\x1b[0m`

//     console.log(logPayload)
//     return
//   }

//   // * All other possible argument types
//   logMessage =
//     messageType === "object"
//       ? message
//       : `\x1b[93m${text}\n${typeColorMap[messageType]}${message}${resetColor}\x1b[0m`

//   logPayload =
//     payloadType === "object"
//       ? payload
//       : `\x1b[93m${typeColorMap[payloadType]}${payload}${resetColor}\x1b[0m`

//   console.log(logMessage, "\n", logPayload)
// }
