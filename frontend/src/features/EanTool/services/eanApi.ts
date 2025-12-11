import axios from 'axios';

export type GenerateEanRequest = {

    prefixo?: string;
    quantity?: number;
};

export type GenerateEanResponse = {
    codes: string[];
};

const api = axios.create({
    baseURL: '/api',
    timeout: 5000,
});

export async function generateEan(payload?: GenerateEanRequest): Promise<GenerateEanResponse> {
    const resp = await api.post<GenerateEanResponse>('/ean/generate', payload ?? {});
    return resp.data;
}