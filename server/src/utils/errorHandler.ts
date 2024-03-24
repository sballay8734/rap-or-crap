import { logServer } from "../helpers/logFormatter"
import { Err } from "../types/error"

export function errorHandler(statusCode: number, message: string): Err {
  const error = new Error(message) as Err

  if (message.length > 50) logServer(`RES MSG IS TOO LONG! MSG: ${message}`)

  error.statusCode = statusCode
  error.message = message

  return error
}
