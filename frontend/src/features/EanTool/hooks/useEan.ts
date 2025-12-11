import { useMutation } from '@tanstack/react-query';
import { GenerateEanRequest, GenerateEanResponse } from '../services/eanApi';
import { api } from '@/lib/axios';

export function useGenerateEan() {
  return useMutation<GenerateEanResponse, Error, GenerateEanRequest | undefined>({
    mutationFn: async (payload?: GenerateEanRequest) => {
      try {
        const resp = await api.post('/ean/generate', payload ?? {});
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

