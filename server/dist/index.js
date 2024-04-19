"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logFormatter_1 = require("./helpers/logFormatter");
const serverConfig_1 = require("./serverConfig");
const port = process.env.PORT || 5001;
const server = (0, serverConfig_1.createServer)();
server.listen(port, () => {
    (0, logFormatter_1.logServer)(`Api running on port ${port}`);
});
//  /auth/undefined/api/auth/signin
