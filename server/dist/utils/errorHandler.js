"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logFormatter_1 = require("../helpers/logFormatter");
function errorHandler(statusCode, message) {
    const error = new Error(message);
    if (message.length > 50)
        (0, logFormatter_1.logServer)(`RES MSG IS TOO LONG! MSG: ${message}`);
    error.statusCode = statusCode;
    error.message = message;
    return error;
}
exports.errorHandler = errorHandler;
