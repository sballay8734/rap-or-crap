const typeColorMap: Record<string, string> = {
  string: "color: #00ff00; font-weight: bold;", // Bright Green
  number: "color: #ffff00; font-weight: bold;", // Bright Yellow
  boolean: "color: #0000ff; font-weight: bold;", // Bright Blue
  object: "color: #ff00ff; font-weight: bold;", // Bright Pink

  undefined: "color: #ff0000; font-weight: bold;", // Dark Red
  error: "color: #ff0000; font-weight: bold;", // Bright Red
  function: "color: #808080; font-weight: bold;", // Gray
  null: "color: #808080; font-weight: bold;", // Gray
  symbol: "color: #808080; font-weight: bold;", // Dark Gray
  bigint: "color: #808080; font-weight: bold;" // Dark Gray
}

const text = "[CLIENT]"

export default function logClient(message?: any, payload?: any) {
  let logMessage = ""
  let logPayload = ""

  const messageType = typeof message
  const payloadType = typeof payload

  // * Handle single null case (null as second arg works)
  if (message === null && payloadType === "undefined") {
    console.log(`%c${text} ${message}`, typeColorMap.null)
    return
  }

  // * Handle double null case
  if (message === null && payload === null) {
    logMessage = `%c${text} ${message}`
    logPayload = `%c${text} ${payload}`

    console.log(logMessage, typeColorMap.null)
    console.log(logPayload, typeColorMap.null)
    return
  }

  // * No arguments provided
  if (!message && !payload) {
    const errMsg = "ARGUMENTS TO LOG FUNCTION ARE REQUIRED"
    console.log(`%c${text} ${errMsg}`, typeColorMap.error)
    return
  }

  // * Don't support symbols
  if (messageType === "symbol" || payloadType === "symbol") {
    const errMsg = "SYMBOLS ARE NOT SUPPORTED"
    console.log(`%c${text} ${errMsg}`, typeColorMap.error)
    return
  }

  // * (_, arg)
  if (messageType === "undefined" && payloadType !== "undefined") {
    payloadType === "object"
      ? console.log(payload)
      : console.log(
          undefined,
          `%c${text} ${payload}`,
          typeColorMap[payloadType]
        )

    return
  }

  // * (arg, _)
  if (messageType !== "undefined" && payloadType === "undefined") {
    messageType === "object"
      ? console.log(message)
      : console.log(
          `%c${text} ${message}`,
          typeColorMap[messageType],
          undefined
        )
    return
  }

  // * All other possible argument types

  messageType === "object"
    ? console.log(message)
    : console.log(`%c${text} ${message}`, typeColorMap[messageType])

  payloadType === "object"
    ? console.log(payload)
    : console.log(`%c${text} ${payload}`, typeColorMap[payloadType])
}
