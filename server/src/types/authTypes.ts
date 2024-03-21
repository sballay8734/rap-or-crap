export interface IUserResponse {
  _id: string;
  email: string;
  displayName: string;
  activeGameId: string;
}

// This is needed for Model
export interface IUserRequest {
  email: string;
  displayName: string;
  password: string;
  activeGameId: string;
}
