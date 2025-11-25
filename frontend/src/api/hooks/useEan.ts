import { useMutation } from '@tanstack/react-query';
import { GenerateEanRequest, GenerateEanResponse } from '../ean';
import { api } from '../../services/api';

export function useGenerateEan() {
    return useMutation<GenerateEanResponse, Error, GenerateEanRequest | undefined>({
    mutationFn: (payload?: GenerateEanRequest) => generateEan(payload),
    
        onError(err: unknown) {
            console.error('Erro gerando EAN', err);
        },
});
}

export async function generateEan(payload?: GenerateEanRequest): Promise<GenerateEanResponse> {
    const resp = await api.post('/generate-ean', payload ?? {});
    return resp.data;    
}
