import {
  ModApiResponse,
  CreatedUser,
  ModErrorResponse,
} from "../../types/responsesFromServer";

export function isModErrorResponse(
  res: ModApiResponse<CreatedUser>,
): res is ModErrorResponse {
  return "error" in res;
}
