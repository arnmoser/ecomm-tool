import { useMutation } from '@tanstack/react-query';
import { GenerateEanRequest, GenerateEanResponse } from '../ean';
import { api } from '../../services/api';

export function useGenerateEan() {
  return useMutation<GenerateEanResponse, Error, GenerateEanRequest | undefined>({
    mutationFn: async (payload?: GenerateEanRequest) => {
      try {
        const resp = await api.post('/generate-ean', payload ?? {});
        return resp.data;
      } catch (err: any) {
        // captura a mensagem vinda do backend
        const backendMsg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          'Erro desconhecido ao gerar EAN';

        throw new Error(backendMsg);
      }
    }
  });
}

export async function generateEan(payload?: GenerateEanRequest): Promise<GenerateEanResponse> {
    const resp = await api.post('/generate-ean', payload ?? {});
    return resp.data;    
}
