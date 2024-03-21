"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successHandler = void 0;
function successHandler(res, statusCode, message, payload) {
    if (message.length > 50)
        console.log(`RES MSG IS TOO LONG! MSG: ${message}`);
    return res.status(statusCode).json({ success: true, message, payload });
}
exports.successHandler = successHandler;
// 200 - OK
// 201 - Created
// more info on 200 codes - https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses
/*
// Successful response
{
  "success": true,
  "data": {
    // Response data here
  }
}

// Error response
{
  "success": false,
  "message": "Error message here"
}
*/
