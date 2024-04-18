"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrompt = void 0;
const prompt_1 = __importDefault(require("../models/prompt"));
const createPrompt = async (req, res, next) => {
    const prompt = req.body;
    try {
        const newPrompt = await prompt_1.default.create(prompt);
        if (!newPrompt)
            return res.status(500).json("Something went wrong!");
        return res.status(200).json(newPrompt);
    }
    catch (error) {
        next(error);
    }
};
exports.createPrompt = createPrompt;
