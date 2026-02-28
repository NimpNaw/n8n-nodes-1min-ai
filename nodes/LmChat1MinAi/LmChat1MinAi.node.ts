import {
  INodeType,
  INodeTypeDescription,
  ISupplyDataFunctions,
  NodeConnectionTypes,
  SupplyData,
} from 'n8n-workflow';

import { MinAiChatModel } from './MinAiChatModel';

// ---------------------------------------------------------------------------
// Confirmed working models for CHAT_WITH_AI on 1min.ai
// ---------------------------------------------------------------------------
const MODELS = [
  // OpenAI
  { name: 'GPT-4o', value: 'gpt-4o' },
  { name: 'GPT-4o Mini', value: 'gpt-4o-mini' },
  { name: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
  { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
  // DeepSeek
  { name: 'DeepSeek Chat', value: 'deepseek-chat' },
  { name: 'DeepSeek R1 (Reasoner)', value: 'deepseek-reasoner' },
  // Mistral
  { name: 'Mistral Large', value: 'mistral-large-latest' },
];

export class LmChat1MinAi implements INodeType {
  description: INodeTypeDescription = {
    displayName: '1min.AI Chat Model',
    name: 'lmChat1MinAi',
    icon: 'file:1minai.svg',
    group: ['transform'],
    version: 1,
    description:
      'Use 1min.AI as a language model for the AI Agent. Confirmed support for GPT-4o, DeepSeek R1 and Mistral.',
    defaults: {
      name: '1min.AI Chat Model',
    },
    codex: {
      categories: ['AI'],
      subcategories: {
        AI: ['Chat Model'],
      },
    },
    inputs: [],
    outputs: [NodeConnectionTypes.AiLanguageModel],
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
        description:
          'The AI model to use. Only models confirmed to work with 1min.ai API are listed.',
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
            description:
              'Maximum number of words the model will generate in its response.',
          },
          {
            displayName: 'Temperature',
            name: 'temperature',
            type: 'number',
            typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 1 },
            default: 0.7,
            description:
              'Controls randomness: 0 = deterministic, 1 = highly creative.',
          },
        ],
      },
    ],
  };

  async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
    const credentials = await this.getCredentials('minAiApi');
    const model = this.getNodeParameter('model', itemIndex) as string;
    const options = this.getNodeParameter('options', itemIndex, {}) as {
      maxTokens?: number;
      temperature?: number;
    };

    const chatModel = new MinAiChatModel({
      apiKey: credentials.apiKey as string,
      model,
      maxTokens: options.maxTokens,
      temperature: options.temperature,
    });

    return {
      response: chatModel,
    };
  }
}
