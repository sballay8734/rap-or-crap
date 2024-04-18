"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../utils/errorHandler");
const authenticateUser = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token)
        return next((0, errorHandler_1.errorHandler)(401, "Unauthorized"));
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === "string") {
            return next((0, errorHandler_1.errorHandler)(400, "Invalid token"));
        }
        if ("id" in decoded) {
            req.userId = decoded.id;
            return next();
        }
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(400, "Could not authenticate user."));
    }
};
exports.authenticateUser = authenticateUser;
