"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGuestGame = exports.getNewPrompt = exports.updateGame = exports.deleteOldActiveGame = exports.fetchActiveGame = exports.initializeGame = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandler_1 = require("../utils/errorHandler");
const gameInstance_1 = __importDefault(require("../models/gameInstance"));
const user_1 = __importDefault(require("../models/user"));
const logFormatter_1 = require("../helpers/logFormatter");
const prompt_1 = __importDefault(require("../models/prompt"));
const initializeGame = async (req, res, next) => {
    const gameData = req.body;
    const userId = req.userId;
    try {
        // Check user exists
        const userToUpdate = await user_1.default.findById(userId);
        if (userToUpdate === null) {
            return next((0, errorHandler_1.errorHandler)(400, "User not found."));
        }
        // deletes old game if one existed
        if (userToUpdate.activeGameId !== "") {
            const gameId = userToUpdate.activeGameId;
            const deletedGame = await gameInstance_1.default.findByIdAndDelete(gameId);
            // logServer("Game found and deleted")
        }
        // gets a random lyric to initialize game with
        const randomPrompt = await prompt_1.default.aggregate().sample(1);
        if (!randomPrompt)
            return next((0, errorHandler_1.errorHandler)(400, "Could not find random lyric."));
        const { lyric, _id } = randomPrompt[0];
        const finalizedGameData = {
            playersObject: gameData.playersObject,
            userId: gameData.userId,
            currentLyric: lyric,
            currentRound: 1,
            currentPromptId: _id.valueOf()
        };
        // Creates game with finializedGameData
        const newGame = await gameInstance_1.default.create(finalizedGameData);
        if (!newGame)
            next((0, errorHandler_1.errorHandler)(400, "Could not initialize game."));
        // third, get gameId and set users active game to that id
        userToUpdate.activeGameId = newGame._id;
        await userToUpdate.save();
        return res.status(200).json(newGame);
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "Could not initialize game."));
    }
};
exports.initializeGame = initializeGame;
const fetchActiveGame = async (req, res, next) => {
    const userId = req.userId;
    if (!userId)
        return next((0, errorHandler_1.errorHandler)(401, "Unauthorized."));
    const user = await user_1.default.findById(userId);
    if (user === null)
        return next((0, errorHandler_1.errorHandler)(400, "User not found."));
    const activeGameId = user.activeGameId;
    if (activeGameId === "") {
        return res.status(200).json(null);
    }
    const activeGame = await gameInstance_1.default.findById(activeGameId);
    if (activeGame === null) {
        (0, logFormatter_1.logServer)("gameController/fetchActiveGame", activeGame);
        return res.status(200).json(null);
    }
    return res.status(200).json(activeGame);
};
exports.fetchActiveGame = fetchActiveGame;
const deleteOldActiveGame = async (req, res, next) => {
    const userId = req.userId;
    if (!userId)
        return next((0, errorHandler_1.errorHandler)(401, "Unauthorized."));
    const user = await user_1.default.findById(userId);
    if (user === null)
        return next((0, errorHandler_1.errorHandler)(400, "User not found."));
    const activeGameId = user.activeGameId;
    if (activeGameId === "") {
        return next((0, errorHandler_1.errorHandler)(400, "No active game."));
    }
    const deletedGame = await gameInstance_1.default.findByIdAndDelete(activeGameId);
    if (deletedGame === null) {
        return next((0, errorHandler_1.errorHandler)(400, "Game not found."));
    }
    const updatedUser = await user_1.default.findByIdAndUpdate(userId, {
        activeGameId: ""
    });
    if (!updatedUser) {
        return next((0, errorHandler_1.errorHandler)(400, "Game deleted, but user could not be updated."));
    }
    return res.status(200).json(null);
};
exports.deleteOldActiveGame = deleteOldActiveGame;
const updateGame = async (req, res, next) => {
    const answersObject = req.body.answersObject;
    const gameId = req.body.gameId;
    const promptId = req.body.promptId;
    if (!promptId || promptId === "") {
        return next((0, errorHandler_1.errorHandler)(400, "No active game."));
    }
    if (!gameId || gameId === "") {
        return next((0, errorHandler_1.errorHandler)(400, "No active game."));
    }
    if (!answersObject || Object.keys(answersObject).length === 0) {
        return next((0, errorHandler_1.errorHandler)(400, "Something went wrong submitting answers."));
    }
    try {
        // * Grab Game
        const gameToUpdate = await gameInstance_1.default.findById(gameId);
        if (gameToUpdate === null) {
            return next((0, errorHandler_1.errorHandler)(400, "Game not found."));
        }
        // * Grab Prompt
        const promptToCompare = await prompt_1.default.findById(promptId);
        if (promptToCompare === null) {
            return next((0, errorHandler_1.errorHandler)(400, "Game not found."));
        }
        // * Compare Answers
        const correctAnswer = promptToCompare.correctAnswer;
        const currentRound = gameToUpdate.currentRound.toString();
        // Flatten the playersObject map
        const flattenedPlayersObject = Object.fromEntries(gameToUpdate.playersObject);
        for (const [key, value] of Object.entries(answersObject)) {
            // Update each player
            const playerData = flattenedPlayersObject[key];
            if (!playerData)
                return; // SHOULD always exist (initialized with game)
            if (value === "skip") {
                playerData.lastQSkipped = true;
                playerData.lastQCorrect = false;
            }
            else if (value === correctAnswer) {
                // They got it right
                playerData.cCorrect += 1;
                playerData.cCorrectStreak += 1;
                playerData.lastQCorrect = true;
                playerData.lastQSkipped = false;
                playerData.history[currentRound] = true;
                // reset wrong streak on correct answer
                playerData.cWrongStreak = 0;
            }
            else {
                // They got it wrong
                playerData.cWrong += 1;
                playerData.cWrongStreak += 1;
                playerData.lastQCorrect = false;
                playerData.lastQSkipped = false;
                playerData.history[currentRound] = false;
                // reset correct streak on wrong answer
                playerData.cCorrectStreak = 0;
            }
            flattenedPlayersObject[key] = playerData;
        }
        // Update the playersObject with the flattened object
        gameToUpdate.playersObject = new Map(Object.entries(flattenedPlayersObject));
        // ! add promptId to list of "seen" prompts
        gameToUpdate.seenPromptIds.push(promptId);
        // * Update Game
        const updatedGame = await gameToUpdate.save();
        if (!updatedGame)
            return next((0, errorHandler_1.errorHandler)(500, "Could not save game."));
        return res
            .status(200)
            .json({ game: updatedGame, completedPrompt: promptToCompare });
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "Something went wrong updating the game."));
    }
};
exports.updateGame = updateGame;
const getNewPrompt = async (req, res, next) => {
    const gameId = req.params.gameId;
    // * get game
    const currentGame = await gameInstance_1.default.findById(gameId);
    if (!currentGame)
        return next((0, errorHandler_1.errorHandler)(400, "Game not found."));
    // * get a new prompt where the new promptId is not in seenPromptIds
    try {
        const seenPromptIds = currentGame.seenPromptIds.map((id) => new mongoose_1.default.Types.ObjectId(id));
        const newPrompt = await prompt_1.default.aggregate([
            { $match: { _id: { $nin: seenPromptIds } } },
            { $sample: { size: 1 } }
        ]);
        if (newPrompt.length === 0) {
            (0, logFormatter_1.logServer)("No prompts remaining.");
            currentGame.currentLyric = "No more lyrics";
            currentGame.currentPromptId = "";
            await currentGame.save();
            return res.status(200).json(currentGame);
        }
        const { lyric, _id } = newPrompt[0];
        // * update gameInstance (currentLyric, currentPromptId, round)
        currentGame.currentLyric = lyric;
        currentGame.currentPromptId = _id;
        currentGame.currentRound += 1;
        await currentGame.save();
        return res.status(200).json(currentGame);
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "Something weird happened while trying to get a new prompt."));
    }
};
exports.getNewPrompt = getNewPrompt;
const initializeGuestGame = async (req, res, next) => {
    console.log(req.body);
    const gameData = req.body;
    try {
        // gets a random lyric to initialize game with
        const randomPrompt = await prompt_1.default.aggregate().sample(1);
        if (!randomPrompt)
            return next((0, errorHandler_1.errorHandler)(400, "Could not find random lyric."));
        const { lyric, _id } = randomPrompt[0];
        const finalizedGameData = {
            playersObject: gameData.playersObject,
            userId: gameData.userId,
            currentLyric: lyric,
            currentRound: 1,
            currentPromptId: _id.valueOf()
        };
        // Creates game with finializedGameData
        const newGame = await gameInstance_1.default.create(finalizedGameData);
        if (!newGame)
            next((0, errorHandler_1.errorHandler)(400, "Could not initialize game."));
        return res.status(200).json(newGame);
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "Could not initialize game."));
    }
};
exports.initializeGuestGame = initializeGuestGame;
