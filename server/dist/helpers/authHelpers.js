"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordsMatch = exports.fieldsAreNotValid = void 0;
// TODO: Refactor this. It's a bit confusing
const fieldsAreNotValid = (email, displayName, password, confirmPassword) => 
// "if email.trim() is NOT falsy - meaning is is not empty
!email.trim() ||
    !displayName.trim() ||
    !password.trim() ||
    !confirmPassword.trim();
exports.fieldsAreNotValid = fieldsAreNotValid;
// if passwords match
const passwordsMatch = (password, confirmPassword) => password === confirmPassword;
exports.passwordsMatch = passwordsMatch;
