"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinAiApi = void 0;
class MinAiApi {
    constructor() {
        this.name = 'minAiApi';
        this.displayName = '1min.AI API';
        this.documentationUrl = 'https://docs.1min.ai/docs/api/create-api-key';
        this.icon = 'file:../nodes/LmChat1MinAi/1minai.svg';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                hint: 'Get your API key at https://app.1min.ai/ → Settings → API',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'API-KEY': '={{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://api.1min.ai',
                url: '/api/features',
                method: 'POST',
                body: {
                    type: 'CHAT_WITH_AI',
                    model: 'gpt-4o-mini',
                    promptObject: {
                        prompt: 'Say OK in one word.',
                        isMixed: false,
                        imageList: [],
                        webSearch: false,
                        numOfSite: 1,
                        maxWord: 10,
                    },
                },
            },
        };
    }
}
exports.MinAiApi = MinAiApi;
//# sourceMappingURL=MinAiApi.credentials.js.map