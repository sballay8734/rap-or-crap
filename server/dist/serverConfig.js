"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = require("body-parser");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const promptsRoute_1 = __importDefault(require("./routes/promptsRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const gameRoute_1 = __importDefault(require("./routes/gameRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logFormatter_1 = require("./helpers/logFormatter");
const uri = process.env.MONGO_URI;
// Connect to mongodb
async function run() {
    try {
        await mongoose_1.default.connect(uri);
        await mongoose_1.default.connection.db.admin().command({ ping: 1 });
        (0, logFormatter_1.logServer)("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch (error) {
        (0, logFormatter_1.logServer)(error);
    }
}
run();
// Server Start
const createServer = () => {
    const app = (0, express_1.default)();
    app
        .disable("x-powered-by")
        // .use(morgan("dev"))
        .use((0, body_parser_1.urlencoded)({ extended: true }))
        .use((0, body_parser_1.json)())
        .use((0, cors_1.default)({ credentials: true, origin: "http://localhost:5173" }))
        .use((0, cookie_parser_1.default)());
    app.use("/api/prompts", promptsRoute_1.default);
    app.use("/api/auth", authRoute_1.default);
    app.use("/api/game", gameRoute_1.default);
    app.use((err, req, res, next) => {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal server error";
        if (message.length > 50)
            (0, logFormatter_1.logServer)(`RES MSG IS TOO LONG! MSG: ${message}`);
        return res.status(statusCode).json({
            success: false,
            message
        });
    });
    return app;
};
exports.createServer = createServer;
