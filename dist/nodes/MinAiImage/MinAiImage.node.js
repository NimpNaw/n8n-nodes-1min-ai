"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinAiImage = void 0;
class MinAiImage {
    constructor() {
        this.description = {
            displayName: '1min.AI Image',
            name: 'minAiImage',
            icon: 'file:1minai.svg',
            group: ['transform'],
            version: 1,
            description: 'Generate images using 1min.AI',
            defaults: {
                name: '1min.AI Image',
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
                    displayName: 'Model',
                    name: 'model',
                    type: 'options',
                    options: [
                        { name: 'DALL-E 3', value: 'dall-e-3' },
                        { name: 'Midjourney', value: 'midjourney' },
                        { name: 'Stable Diffusion XL', value: 'stable-diffusion-xl-v1-0' },
                        { name: 'Flux Pro', value: 'flux-pro' },
                    ],
                    default: 'dall-e-3',
                },
                {
                    displayName: 'Prompt',
                    name: 'prompt',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'The description of the image to generate',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Aspect Ratio',
                            name: 'aspect_ratio',
                            type: 'options',
                            options: [
                                { name: '1:1', value: '1:1' },
                                { name: '16:9', value: '16:9' },
                                { name: '9:16', value: '9:16' },
                                { name: '4:3', value: '4:3' },
                                { name: '3:4', value: '3:4' },
                            ],
                            default: '1:1',
                        },
                        {
                            displayName: 'Size',
                            name: 'size',
                            type: 'options',
                            options: [
                                { name: '1024x1024', value: '1024x1024' },
                                { name: '1024x1792', value: '1024x1792' },
                                { name: '1792x1024', value: '1792x1024' },
                            ],
                            default: '1024x1024',
                            description: 'For DALL-E 3',
                        },
                        {
                            displayName: 'Quality',
                            name: 'quality',
                            type: 'options',
                            options: [
                                { name: 'Standard', value: 'standard' },
                                { name: 'HD', value: 'hd' },
                            ],
                            default: 'standard',
                            description: 'For DALL-E 3',
                        },
                        {
                            displayName: 'Mode',
                            name: 'mode',
                            type: 'options',
                            options: [
                                { name: 'Relax', value: 'relax' },
                                { name: 'Fast', value: 'fast' },
                                { name: 'Turbo', value: 'turbo' },
                            ],
                            default: 'relax',
                            description: 'For Midjourney',
                        },
                    ],
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
                const model = this.getNodeParameter('model', i);
                const prompt = this.getNodeParameter('prompt', i);
                const optionsParams = this.getNodeParameter('options', i, {});
                const promptObject = {
                    prompt,
                    ...optionsParams,
                };
                // Force required fields discovered in tests
                if (model === 'midjourney') {
                    promptObject.mode = optionsParams.mode || 'relax';
                    promptObject.n = 1;
                }
                if (model === 'dall-e-3') {
                    promptObject.size = optionsParams.size || '1024x1024';
                    promptObject.quality = optionsParams.quality || 'standard';
                }
                const body = {
                    type: 'TEXT_TO_IMAGE',
                    model,
                    promptObject,
                };
                const response = await fetch('https://api.1min.ai/api/features', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'API-KEY': credentials.apiKey,
                    },
                    body: JSON.stringify(body),
                });
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
exports.MinAiImage = MinAiImage;
//# sourceMappingURL=MinAiImage.node.js.map