export default function logClient(message?: any, payload?: any) {
  let logMessage = ""
  let logPayload = ""

  if (!message && !payload) {
    // If 0 arguments provided
    return
  } else if (typeof message !== "string" && !payload) {
    // If one, non-string argument is provided
    logPayload = message
    console.log("%c[CLIENT]", "color: #00ff11; font-weight: bold;", logPayload)
  } else if (!payload && typeof message === "string") {
    // If one string argument is provided
    logPayload = message
    console.log(
      `%c[CLIENT] ${logPayload}`,
      "color: #00ff11; font-weight: bold;"
    )
  } else if (typeof message === "string" && typeof payload === "object") {
    // If message is a string and payload is an object
    logMessage = message ? `%c[CLIENT] ${message}` : ""
    logPayload = typeof payload === "string" ? `%c${payload}` : payload

    const styles = []
    if (logMessage) {
      styles.push("color: #00ff11; font-weight: bold;")
    }
    if (typeof payload === "string") {
      styles.push("color: inherit; font-weight: inherit;")
    }

    console.log(logMessage, ...styles, logPayload)
  } else {
    console.error("UNCAUGHT LOG FORMAT")
  }
}

// (object) *
// (string) *
// (string, object) *
