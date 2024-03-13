export interface SignUpFormData {
  email: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

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
