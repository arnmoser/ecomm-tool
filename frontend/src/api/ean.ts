import axios from 'axios';

export type GenerateEanRequest = {

    prefix?: string;
    quantity?: number;
};

export type GenerateEanResponse = {
    codes: string[];
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
    timeout: 5000,
});

export async function generateEan(payload?: GenerateEanRequest): Promise<GenerateEanResponse> {
    const resp = await api.post<GenerateEanResponse>('/tool/ean',payload ?? {});
    return resp.data;
}