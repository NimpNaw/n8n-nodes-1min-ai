import {
  BaseChatModel,
  BaseChatModelCallOptions,
  BaseChatModelParams,
} from '@langchain/core/language_models/chat_models';
import { BaseMessage, AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatResult, ChatGeneration } from '@langchain/core/outputs';
import { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MinAiChatModelParams extends BaseChatModelParams {
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

interface MinAiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface MinAiRequestBody {
  type: string;
  model: string;
  promptObject: {
    prompt: string;
    isMixed: boolean;
    imageList: string[];
    webSearch: boolean;
    numOfSite: number;
    maxWord: number;
    messages?: MinAiMessage[];
  };
}

interface MinAiResponse {
  aiRecord?: {
    aiRecordDetail?: {
      resultObject?: string[];
    };
  };
  // Some responses return the result directly
  resultObject?: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function lcMessageToMinAi(msg: BaseMessage): MinAiMessage {
  const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);

  if (msg instanceof HumanMessage) return { role: 'user', content };
  if (msg instanceof AIMessage) return { role: 'assistant', content };
  if (msg instanceof SystemMessage) return { role: 'system', content };

  return { role: 'user', content };
}

function extractLastUserPrompt(messages: BaseMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i] instanceof HumanMessage) {
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

export class MinAiChatModel extends BaseChatModel<BaseChatModelCallOptions> {
  private readonly apiKey: string;
  readonly model: string;
  private readonly maxTokens: number;
  readonly temperature: number;

  // Added for n8n/LangChain tool compatibility
  readonly _is_tool_calling = true;

  constructor(params: MinAiChatModelParams) {
    super(params);
    this.apiKey = params.apiKey;
    this.model = params.model;
    this.maxTokens = params.maxTokens ?? 2048;
    this.temperature = params.temperature ?? 0.7;
  }

  // Necessary for LangChain tool binding
  bindTools(
    tools: any[],
    _kwargs?: Partial<BaseChatModelCallOptions>,
  ): any {
    return this;
  }

  _llmType(): string {
    return 'min_ai';
  }

  async _generate(
    messages: BaseMessage[],
    _options: this['ParsedCallOptions'],
    _runManager?: CallbackManagerForLLMRun,
  ): Promise<ChatResult> {
    const prompt = extractLastUserPrompt(messages);
    const minAiMessages: MinAiMessage[] = messages.slice(0, -1).map(lcMessageToMinAi);

    const body: MinAiRequestBody = {
      type: 'CHAT_WITH_AI',
      model: this.model,
      promptObject: {
        prompt,
        isMixed: false,
        imageList: [],
        webSearch: false,
        numOfSite: 1,
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

    const data = (await response.json()) as MinAiResponse;

    // Extract the generated text from the response
    let text = '';
    const resultObject =
      data?.aiRecord?.aiRecordDetail?.resultObject ?? data?.resultObject;

    if (Array.isArray(resultObject) && resultObject.length > 0) {
      text = resultObject[0];
    } else {
      // Attempt to extract from the raw response
      const raw = JSON.stringify(data);
      throw new Error(`Unexpected 1min.AI response format: ${raw}`);
    }

    const generation: ChatGeneration = {
      text,
      message: new AIMessage(text),
    };

    return { generations: [generation] };
  }
}
