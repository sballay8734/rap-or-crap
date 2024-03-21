import {
  ModApiResponse,
  CreatedUser,
  ModErrorResponse
} from "../../types/responsesFromServer"

interface CustomApiError {
  error: {
    data: {
      success: false
      message: string
    }
    status: number
    isUnhandledError: boolean
  }
}

export function isModErrorResponse(
  res: ModApiResponse<CreatedUser>
): res is ModErrorResponse {
  return "error" in res
}

export function isCustomApiResponse(err: unknown): err is CustomApiError {
  return (
    typeof err === "object" &&
    err !== null &&
    "error" in err &&
    typeof (err as any).error === "object" &&
    "data" in (err as any).error &&
    "message" in (err as any).error.data
  )
}
