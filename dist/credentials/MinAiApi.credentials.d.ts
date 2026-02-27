import { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class MinAiApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: "file:../nodes/LmChat1MinAi/1minai.svg";
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
    test: ICredentialTestRequest;
}
