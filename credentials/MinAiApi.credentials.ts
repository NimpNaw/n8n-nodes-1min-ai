import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class MinAiApi implements ICredentialType {
  name = 'minAiApi';
  displayName = '1min.AI API';
  documentationUrl = 'https://docs.1min.ai/docs/api/create-api-key';
  icon = 'file:../nodes/LmChat1MinAi/1minai.svg' as const;

  properties: INodeProperties[] = [
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

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'API-KEY': '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
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
