// * Error & Success
export interface ErrorResponse {
  success: false;
  message: string;
}

export interface SuccessResponse<T> {
  success: true;
  message: string;
  payload: T;
}

export type ApiResponse<T> = { data: ErrorResponse | SuccessResponse<T> };

// * Modified Responses due to Redux-Toolkit modifying the response object

export interface ModErrorResponse {
  error: {
    data: ErrorResponse;
    status: number;
  };
}

interface ModSuccessResponse<T> {
  data: SuccessResponse<T>;
}

export type ModApiResponse<T> = ModErrorResponse | ModSuccessResponse<T>;

// * T types (these are all of the type that can be returned by the server during a successful request)

// Returned after successful signup
export interface CreatedUser {
  _id: string;
  email: string;
  displayName: string;
  activeGameId: string;
}
