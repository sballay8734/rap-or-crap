export interface IUserRequest {
  email: string;
  displayName: string;
  password: string;
}

export interface IUserResponse {
  _id: string;
  email: string;
  displayName: string;
  activeGameId: string;
}
