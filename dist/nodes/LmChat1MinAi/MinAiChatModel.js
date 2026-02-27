"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinAiChatModel = void 0;
const chat_models_1 = require("@langchain/core/language_models/chat_models");
const messages_1 = require("@langchain/core/messages");
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function lcMessageToMinAi(msg) {
    const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
    if (msg instanceof messages_1.HumanMessage)
        return { role: 'user', content };
    if (msg instanceof messages_1.AIMessage)
        return { role: 'assistant', content };
    if (msg instanceof messages_1.SystemMessage)
        return { role: 'system', content };
    return { role: 'user', content };
}
function extractLastUserPrompt(messages) {
    for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i] instanceof messages_1.HumanMessage) {
            const c = messages[i].content;
            return typeof c === 'string' ? c : JSON.stringify(c);
        }
    }
    // Fallback: use the very last message content
    const last = messages[messages.length - 1];
    const c = last.content;
    return typeof c === 'string' ? c : JSON.stringify(c);
}
// ---------------------------------------------------------------------------
// MinAiChatModel
// ---------------------------------------------------------------------------
class MinAiChatModel extends chat_models_1.BaseChatModel {
    constructor(params) {
        var _a, _b, _c, _d;
        super(params);
        this.apiKey = params.apiKey;
        this.model = params.model;
        this.maxTokens = (_a = params.maxTokens) !== null && _a !== void 0 ? _a : 2048;
        this.temperature = (_b = params.temperature) !== null && _b !== void 0 ? _b : 0.7;
        this.webSearch = (_c = params.webSearch) !== null && _c !== void 0 ? _c : false;
        this.numOfSite = (_d = params.numOfSite) !== null && _d !== void 0 ? _d : 3;
    }
    _llmType() {
        return 'min_ai';
    }
    async _generate(messages, _options, _runManager) {
        var _a, _b, _c;
        const prompt = extractLastUserPrompt(messages);
        const minAiMessages = messages.slice(0, -1).map(lcMessageToMinAi);
        const body = {
            type: 'CHAT_WITH_AI',
            model: this.model,
            promptObject: {
                prompt,
                isMixed: false,
                imageList: [],
                webSearch: this.webSearch,
                numOfSite: this.numOfSite,
                maxWord: this.maxTokens,
            },
        };
        // Include conversation history when there are prior messages
        if (minAiMessages.length > 0) {
            body.promptObject.messages = minAiMessages;
        }
        const response = await fetch('https://api.1min.ai/api/features', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'API-KEY': this.apiKey,
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`1min.AI API error ${response.status}: ${errorText}`);
        }
        const data = (await response.json());
        // Extract the generated text from the response
        let text = '';
        const resultObject = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.aiRecord) === null || _a === void 0 ? void 0 : _a.aiRecordDetail) === null || _b === void 0 ? void 0 : _b.resultObject) !== null && _c !== void 0 ? _c : data === null || data === void 0 ? void 0 : data.resultObject;
        if (Array.isArray(resultObject) && resultObject.length > 0) {
            text = resultObject[0];
        }
        else {
            // Attempt to extract from the raw response
            const raw = JSON.stringify(data);
            throw new Error(`Unexpected 1min.AI response format: ${raw}`);
        }
        const generation = {
            text,
            message: new messages_1.AIMessage(text),
        };
        return { generations: [generation] };
    }
}
exports.MinAiChatModel = MinAiChatModel;
//# sourceMappingURL=MinAiChatModel.js.map