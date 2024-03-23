const typeColorMap: Record<string, string> = {
  string: "\x1b[92m", // Bright Green
  number: "\x1b[93m", // Bright Yellow
  boolean: "\x1b[94m", // Bright Blue
  object: "\x1b[95m", // Bright Pink

  undefined: "\x1b[31m", // Dark Red
  error: "\x1b[91m", // Bright Red
  function: "\x1b[37m", // Gray
  null: "\x1b[37m", // Gray
  symbol: "\x1b[90m", // Dark Gray
  bigint: "\x1b[90m" // Dark Gray
}

const resetColor = "\x1b[0m" // Reset color code
const text =
  "[SERVER] -----------------------------------------------------------------------------"

export default function logServer(message?: any, payload?: any) {
  let logMessage = ""
  let logPayload = ""

  const messageType = typeof message
  const payloadType = typeof payload

  // * Handle single null case (null as second arg works)
  if (message === null && payloadType === "undefined") {
    logPayload = `\x1b[93m${text}\n${typeColorMap.null}${message}${resetColor}\x1b[0m`

    console.log(logPayload)
    return
  }

  // * Handle double null case
  if (message === null && payload === null) {
    logMessage = `\x1b[93m${text}\n${typeColorMap.null}${message}${resetColor}\x1b[0m`
    logPayload = `\x1b[93m${typeColorMap.null}${payload}${resetColor}\x1b[0m`

    console.log(logMessage, logPayload)
    return
  }

  // * No arguments provided
  if (!message && !payload) {
    logPayload = `\x1b[93m${text}\n${typeColorMap.error}ARGUMENTS TO LOG FUNCTION ARE REQUIRED${resetColor}\x1b[0m`
    console.log(logPayload)
    return
  }

  // * Don't support symbols
  if (messageType === "symbol" || payloadType === "symbol") {
    logPayload = `\x1b[93m${text}\n${typeColorMap.error}Symbols are not supported${resetColor}\x1b[0m`
    console.log(logPayload)
    return
  }

  // * (_, arg)
  if (messageType === "undefined" && payloadType !== "undefined") {
    logPayload =
      payloadType === "object"
        ? payload
        : `\x1b[93m${typeColorMap[payloadType]}${payload}${resetColor}\x1b[0m`

    console.log(logPayload)
    return
  }

  // * (arg, _)
  if (messageType !== "undefined" && payloadType === "undefined") {
    logPayload =
      messageType === "object"
        ? message
        : `\x1b[93m${typeColorMap[messageType]}${message}${resetColor}\x1b[0m`

    console.log(logPayload)
    return
  }

  // * All other possible argument types
  logMessage =
    messageType === "object"
      ? message
      : `\x1b[93m${text}\n${typeColorMap[messageType]}${message}${resetColor}\x1b[0m`

  logPayload =
    payloadType === "object"
      ? payload
      : `\x1b[93m${typeColorMap[payloadType]}${payload}${resetColor}\x1b[0m`

  console.log(logMessage, "\n", logPayload)
}
