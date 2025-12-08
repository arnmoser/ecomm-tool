import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EanTool from '../EanTool/EanTool'; 
import * as api from '../../ean';

const makeClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('EanTool', () => {
  it('gera e exibe um EAN quando o usuário clica', async () => {
    const mockCode = '1234567890123';
    jest.spyOn(api, 'generateEan').mockResolvedValueOnce({ codes: [mockCode] });

    render(
      <QueryClientProvider client={makeClient()}>
        <EanTool />
      </QueryClientProvider>
    );

    const genBtn = screen.getByRole('button', { name: /Gerar Código EAN/i });
    await userEvent.click(genBtn);

    await waitFor(() => expect(screen.getByText(mockCode)).toBeInTheDocument());
  });

  it('mostra estado de erro quando a API falha', async () => {
    jest.spyOn(api, 'generateEan').mockRejectedValueOnce(new Error('server error'));

    render(
      <QueryClientProvider client={makeClient()}>
        <EanTool />
      </QueryClientProvider>
    );

    const genBtn = screen.getByRole('button', { name: /Gerar Código EAN/i });
    await userEvent.click(genBtn);

    await waitFor(() => expect(screen.getByText(/Erro:/i)).toBeInTheDocument());
  });
});
