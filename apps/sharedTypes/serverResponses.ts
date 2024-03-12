// ! NOTE: All successful responses will have the same structure. The only difference will be the structure of the data

// ERROR RESPONSE **********************************************************
interface ErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

// SUCCESS RESPONSE
interface SuccessResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  payload: T;
}

export type ApiResponse<T> = ErrorResponse | SuccessResponse<T>;

// SIGN IN RESPONSES **********************************************************
