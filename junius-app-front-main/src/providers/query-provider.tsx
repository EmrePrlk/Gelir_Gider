'use client';

import React from 'react';
import { AxiosError } from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (
          error instanceof AxiosError &&
          (error.response?.status === 401 ||
            error.response?.status === 403 ||
            error.response?.status === 404)
        ) {
          return false;
        }

        return failureCount < 4;
      },
    },
  },
});

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
