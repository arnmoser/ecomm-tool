import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EanTool from './api/pages/EanTool';

const queryClient = new QueryClient();

export default function App(): React.ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <EanTool />
    </QueryClientProvider>
  );
}

