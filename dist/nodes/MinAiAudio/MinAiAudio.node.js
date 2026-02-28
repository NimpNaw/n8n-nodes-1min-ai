"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinAiAudio = void 0;
class MinAiAudio {
    constructor() {
        this.description = {
            displayName: '1min.AI Audio',
            name: 'minAiAudio',
            icon: 'file:1minai.svg',
            group: ['transform'],
            version: 1,
            description: 'Text-to-Speech and Speech-to-Text using 1min.AI',
            defaults: {
                name: '1min.AI Audio',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'minAiApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Text-to-Speech',
                            value: 'textToSpeech',
                        },
                        {
                            name: 'Speech-to-Text',
                            value: 'speechToText',
                        },
                    ],
                    default: 'textToSpeech',
                },
                // ----------------------------------
                // Text-to-Speech Fields
                // ----------------------------------
                {
                    displayName: 'Text',
                    name: 'text',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: ['textToSpeech'],
                        },
                    },
                    default: '',
                    description: 'The text to convert to audio',
                },
                {
                    displayName: 'Model',
                    name: 'model',
                    type: 'options',
                    displayOptions: {
                        show: {
                            resource: ['textToSpeech'],
                        },
                    },
                    options: [
                        { name: 'OpenAI TTS-1', value: 'tts-1' },
                        { name: 'OpenAI TTS-1 HD', value: 'tts-1-hd' },
                    ],
                    default: 'tts-1',
                },
                {
                    displayName: 'Voice',
                    name: 'voice',
                    type: 'options',
                    displayOptions: {
                        show: {
                            resource: ['textToSpeech'],
                        },
                    },
                    options: [
                        { name: 'Alloy', value: 'alloy' },
                        { name: 'Echo', value: 'echo' },
                        { name: 'Fable', value: 'fable' },
                        { name: 'Onyx', value: 'onyx' },
                        { name: 'Nova', value: 'nova' },
                        { name: 'Shimmer', value: 'shimmer' },
                    ],
                    default: 'alloy',
                },
                // ----------------------------------
                // Speech-to-Text Fields
                // ----------------------------------
                {
                    displayName: 'Audio URL',
                    name: 'audioUrl',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: ['speechToText'],
                        },
                    },
                    default: '',
                    description: 'The URL of the audio file to transcribe',
                },
                {
                    displayName: 'Model',
                    name: 'sttModel',
                    type: 'options',
                    displayOptions: {
                        show: {
                            resource: ['speechToText'],
                        },
                    },
                    options: [
                        { name: 'Whisper 1', value: 'whisper-1' },
                    ],
                    default: 'whisper-1',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials('minAiApi');
        for (let i = 0; i < items.length; i++) {
            try {
                const resource = this.getNodeParameter('resource', i);
                let body = {};
                if (resource === 'textToSpeech') {
                    const text = this.getNodeParameter('text', i);
                    const model = this.getNodeParameter('model', i);
                    const voice = this.getNodeParameter('voice', i);
                    body = {
                        type: 'TEXT_TO_SPEECH',
                        model,
                        promptObject: {
                            text,
                            voice,
                        },
                    };
                }
                else {
                    const audioUrl = this.getNodeParameter('audioUrl', i);
                    const model = this.getNodeParameter('sttModel', i);
                    body = {
                        type: 'SPEECH_TO_TEXT',
                        model,
                        promptObject: {
                            audioUrl,
                            response_format: 'text',
                        },
                    };
                }
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'API-KEY': credentials.apiKey,
                    },
                    body: JSON.stringify(body),
                };
                const response = await fetch('https://api.1min.ai/api/features', options);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(`1min.AI API error: ${JSON.stringify(data)}`);
                }
                returnData.push({
                    json: data,
                });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message } });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.MinAiAudio = MinAiAudio;
//# sourceMappingURL=MinAiAudio.node.js.map