// TODO: Refactor this. It's a bit confusing
export const fieldsAreNotValid = (
  email: string,
  displayName: string,
  password: string,
  confirmPassword: string,
) =>
  // "if email.trim() is NOT falsy - meaning is is not empty
  !email.trim() ||
  !displayName.trim() ||
  !password.trim() ||
  !confirmPassword.trim();

// if passwords match
export const passwordsMatch = (password: string, confirmPassword: string) =>
  password === confirmPassword;
