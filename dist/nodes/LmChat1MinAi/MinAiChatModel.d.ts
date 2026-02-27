import { BaseChatModel, BaseChatModelCallOptions, BaseChatModelParams } from '@langchain/core/language_models/chat_models';
import { BaseMessage } from '@langchain/core/messages';
import { ChatResult } from '@langchain/core/outputs';
import { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
export interface MinAiChatModelParams extends BaseChatModelParams {
    apiKey: string;
    model: string;
    maxTokens?: number;
    temperature?: number;
    webSearch?: boolean;
    numOfSite?: number;
}
export declare class MinAiChatModel extends BaseChatModel<BaseChatModelCallOptions> {
    private readonly apiKey;
    readonly model: string;
    private readonly maxTokens;
    readonly temperature: number;
    private readonly webSearch;
    private readonly numOfSite;
    constructor(params: MinAiChatModelParams);
    _llmType(): string;
    _generate(messages: BaseMessage[], _options: this['ParsedCallOptions'], _runManager?: CallbackManagerForLLMRun): Promise<ChatResult>;
}
