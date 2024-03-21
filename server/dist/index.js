"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverConfig_1 = require("./serverConfig");
const port = process.env.PORT || 5001;
const server = (0, serverConfig_1.createServer)();
server.listen(port, () => {
    console.log("\x1b[36m%s\x1b[0m", `api running on ${port}`);
});
