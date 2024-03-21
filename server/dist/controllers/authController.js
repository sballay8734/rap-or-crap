"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signout = exports.signin = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../utils/errorHandler");
const successHandler_1 = require("../utils/successHandler");
const user_1 = __importDefault(require("../models/user"));
const authHelpers_1 = require("../helpers/authHelpers");
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, displayName, password, confirmPassword } = req.body;
    // if a field is blank
    if ((0, authHelpers_1.fieldsAreNotValid)(email, displayName, password, confirmPassword)) {
        return next((0, errorHandler_1.errorHandler)(400, "All fields are required."));
    }
    // if passwords don't match
    if (!authHelpers_1.passwordsMatch) {
        return next((0, errorHandler_1.errorHandler)(400, "Passwords do not match."));
    }
    // if email already exists
    // !FIXME: Need to lowercase email!
    const existingUser = yield user_1.default.findOne({ email });
    console.log(existingUser);
    if (existingUser)
        return next((0, errorHandler_1.errorHandler)(409, "That user already exists."));
    try {
        const newUser = yield user_1.default.create({
            email,
            displayName,
            // TODO: Move salt value to dotenv file
            password: bcrypt_1.default.hashSync(password, 13)
        });
        if (!newUser)
            return next((0, errorHandler_1.errorHandler)(500, "Could not create user."));
        const userResponse = {
            _id: newUser._id.toString(), // Convert ObjectId to string
            email: newUser.email,
            displayName: newUser.displayName,
            activeGameId: newUser.activeGameId || ""
        };
        return (0, successHandler_1.successHandler)(res, 200, "Account creation successful!", userResponse);
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "Something went wrong."));
    }
});
exports.signup = signup;
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const validUser = yield user_1.default.findOne({ email });
        if (!validUser)
            return next((0, errorHandler_1.errorHandler)(400, "Email or password is incorrect"));
        const validPassword = bcrypt_1.default.compareSync(password, validUser.password);
        if (!validPassword)
            return next((0, errorHandler_1.errorHandler)(400, "Email or password is incorrect"));
        const token = jsonwebtoken_1.default.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const userObject = validUser.toObject();
        const { password: pass } = userObject, rest = __rest(userObject, ["password"]);
        res.cookie("access_token", token, { httpOnly: true });
        return (0, successHandler_1.successHandler)(res, 200, "Sign in successful!", rest);
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "Could not signin."));
    }
});
exports.signin = signin;
const signout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // return next(errorHandler(500, "TEST"))
        res.clearCookie("access_token");
        return (0, successHandler_1.successHandler)(res, 200, "User has been logged out!", {});
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "Failed to sign out user."));
    }
});
exports.signout = signout;
