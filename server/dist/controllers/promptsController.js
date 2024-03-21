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
exports.createPrompt = void 0;
const prompt_1 = __importDefault(require("../models/prompt"));
const createPrompt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = req.body;
    try {
        const newPrompt = yield prompt_1.default.create(prompt);
        if (!newPrompt)
            return res.status(500).json("Something went wrong!");
        return res.status(200).json(newPrompt);
    }
    catch (error) {
        next(error);
    }
});
exports.createPrompt = createPrompt;
