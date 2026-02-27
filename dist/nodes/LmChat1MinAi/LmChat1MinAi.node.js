"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LmChat1MinAi = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const MinAiChatModel_1 = require("./MinAiChatModel");
// ---------------------------------------------------------------------------
// Available models on 1min.ai (as of February 2026)
// ---------------------------------------------------------------------------
const MODELS = [
    // OpenAI
    { name: 'GPT-4o', value: 'gpt-4o' },
    { name: 'GPT-4o Mini', value: 'gpt-4o-mini' },
    { name: 'GPT-4.1', value: 'gpt-4.1' },
    { name: 'GPT-4.1 Mini', value: 'gpt-4.1-mini' },
    { name: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
    { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
    // Anthropic Claude
    { name: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20241022' },
    { name: 'Claude 3.5 Haiku', value: 'claude-3-5-haiku-20241022' },
    { name: 'Claude 3 Opus', value: 'claude-3-opus-20240229' },
    // Google
    { name: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash' },
    { name: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' },
    { name: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash' },
    // Meta Llama
    { name: 'Llama 3.3 70B', value: 'meta-llama/Llama-3.3-70B-Instruct-Turbo' },
    { name: 'Llama 3.1 405B', value: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo' },
    // Mistral
    { name: 'Mistral Large', value: 'mistral-large-latest' },
    { name: 'Mistral Nemo', value: 'mistral-nemo' },
    // DeepSeek
    { name: 'DeepSeek Chat', value: 'deepseek-chat' },
    { name: 'DeepSeek R1', value: 'deepseek-reasoner' },
    // Grok
    { name: 'Grok 2', value: 'grok-2' },
    // Perplexity
    { name: 'Perplexity Sonar', value: 'llama-3.1-sonar-large-128k-online' },
];
class LmChat1MinAi {
    constructor() {
        this.description = {
            displayName: '1min.AI Chat Model',
            name: 'lmChat1MinAi',
            icon: 'file:1minai.svg',
            group: ['transform'],
            version: 1,
            description: 'Use 1min.AI as a language model for the AI Agent and other LangChain nodes. Provides access to GPT-4o, Claude, Gemini, Llama, DeepSeek, and more through a single API key.',
            defaults: {
                name: '1min.AI Chat Model',
            },
            codex: {
                categories: ['AI'],
                subcategories: {
                    AI: ['Language Models', 'Root Nodes'],
                },
                resources: {
                    primaryDocumentation: [
                        {
                            url: 'https://docs.1min.ai/docs/api/intro',
                        },
                    ],
                },
            },
            // This node supplies data (acts as a sub-node / language model)
            inputs: [],
            outputs: [n8n_workflow_1.NodeConnectionTypes.AiLanguageModel],
            outputNames: ['Model'],
            credentials: [
                {
                    name: 'minAiApi',
                    required: true,
                },
            ],
            requestDefaults: {
                baseURL: 'https://api.1min.ai',
            },
            properties: [
                {
                    displayName: 'Model',
                    name: 'model',
                    type: 'options',
                    options: MODELS.map((m) => ({ name: m.name, value: m.value })),
                    default: 'gpt-4o-mini',
                    description: 'The AI model to use. All models are accessed through your single 1min.AI API key.',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Max Tokens (Max Words)',
                            name: 'maxTokens',
                            type: 'number',
                            typeOptions: { minValue: 1 },
                            default: 2048,
                            description: 'Maximum number of words the model will generate in its response.',
                        },
                        {
                            displayName: 'Temperature',
                            name: 'temperature',
                            type: 'number',
                            typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 1 },
                            default: 0.7,
                            description: 'Controls randomness: 0 = deterministic, 1 = highly creative.',
                        },
                        {
                            displayName: 'Web Search',
                            name: 'webSearch',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to allow the model to search the web for up-to-date information.',
                        },
                        {
                            displayName: 'Number of Sites (Web Search)',
                            name: 'numOfSite',
                            type: 'number',
                            typeOptions: { minValue: 1, maxValue: 10 },
                            default: 3,
                            displayOptions: {
                                show: {
                                    webSearch: [true],
                                },
                            },
                            description: 'Number of web pages to consult when web search is enabled.',
                        },
                    ],
                },
            ],
        };
    }
    async supplyData(itemIndex) {
        const credentials = await this.getCredentials('minAiApi');
        const model = this.getNodeParameter('model', itemIndex);
        const options = this.getNodeParameter('options', itemIndex, {});
        const chatModel = new MinAiChatModel_1.MinAiChatModel({
            apiKey: credentials.apiKey,
            model,
            maxTokens: options.maxTokens,
            temperature: options.temperature,
            webSearch: options.webSearch,
            numOfSite: options.numOfSite,
        });
        return {
            response: chatModel,
        };
    }
    // Required by INodeType but not used for supply-data nodes
    async execute() {
        return [this.getInputData()];
    }
}
exports.LmChat1MinAi = LmChat1MinAi;
//# sourceMappingURL=LmChat1MinAi.node.js.map