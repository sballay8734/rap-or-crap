"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
function errorHandler(statusCode, message) {
    const error = new Error(message);
    if (message.length > 50)
        console.log(`RES MSG IS TOO LONG! MSG: ${message}`);
    error.statusCode = statusCode;
    error.message = message;
    return error;
}
exports.errorHandler = errorHandler;
