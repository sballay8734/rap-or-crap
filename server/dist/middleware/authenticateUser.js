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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../utils/errorHandler");
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.access_token;
    if (!token)
        return next((0, errorHandler_1.errorHandler)(401, "Unauthorized"));
    try {
        const data = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof data === "string") {
            return next((0, errorHandler_1.errorHandler)(400, "Invalid token"));
        }
        if (req.userId) {
            req.userId = data.id;
            return next();
        }
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(400, "Could not authenticate user."));
    }
});
exports.authenticateUser = authenticateUser;
