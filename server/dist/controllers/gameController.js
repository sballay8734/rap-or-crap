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
exports.fetchActiveGame = exports.initializeGame = void 0;
const errorHandler_1 = require("../utils/errorHandler");
const gameInstance_1 = __importDefault(require("../models/gameInstance"));
const initializeGame = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const gameData = req.body;
    try {
        const newGame = yield gameInstance_1.default.create(gameData);
        if (!newGame)
            next((0, errorHandler_1.errorHandler)(400, "Could not initialize game."));
        return res.status(200).json(newGame);
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "Could not initialize game."));
    }
});
exports.initializeGame = initializeGame;
const fetchActiveGame = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Fetching active game...");
    // 1. Verify user.
    // 2. Grab id of game from user activeGame.
    // 3. Fetch and return game.
});
exports.fetchActiveGame = fetchActiveGame;
