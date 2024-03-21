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
exports.createServer = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = require("body-parser");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const promptsRoute_1 = __importDefault(require("./routes/promptsRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const gameRoute_1 = __importDefault(require("./routes/gameRoute"));
const uri = process.env.MONGO_URI;
// Connect to mongodb
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(uri);
            yield mongoose_1.default.connection.db.admin().command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        }
        catch (error) {
            console.log(error);
        }
    });
}
run();
// Server Start
const createServer = () => {
    const app = (0, express_1.default)();
    app
        .disable("x-powered-by")
        .use((0, morgan_1.default)("dev"))
        .use((0, body_parser_1.urlencoded)({ extended: true }))
        .use((0, body_parser_1.json)())
        .use((0, cors_1.default)());
    app.use("/api/prompts", promptsRoute_1.default);
    app.use("/api/auth", authRoute_1.default);
    app.use("/api/game", gameRoute_1.default);
    app.use((err, req, res, next) => {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal server error";
        if (message.length > 50)
            console.log(`RES MSG IS TOO LONG! MSG: ${message}`);
        return res.status(statusCode).json({
            success: false,
            message
        });
    });
    return app;
};
exports.createServer = createServer;
