/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import {
  parse2DesiredPagination,
  type ActualPaginationResponse,
  parse2ActualPaginationRequest,
} from 'src/utils/pagination-parser';

import { env } from 'src/env';
import { useAuthStore } from 'src/stores/auth-store';

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_HOST_API,
});

export const secureApi = axios.create({
  baseURL: env.NEXT_PUBLIC_HOST_API,
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function handleApiError(error) {
  // custom error handler logic here
  return Promise.reject(error);
}

// Add pagination parsing to both api and secureApi
api.interceptors.response.use(
  response => response,
  error => handleApiError(error),
);

// request interceptor to add the auth token header to requests
secureApi.interceptors.request.use(config => {
  const { tokens } = useAuthStore.getState();

  if (tokens) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }

  // Add pagination parsing logic here
  const parsedUrl = new URL(config.url || '', config.baseURL);
  const queryParams = parsedUrl.searchParams;

  if (queryParams.has('page') && queryParams.has('limit')) {
    const page = queryParams.get('page');
    const limit = queryParams.get('limit');
    const actualPaginationRequest = parse2ActualPaginationRequest({
      page: Number(page),
      limit: Number(limit),
    });

    // Rebuild the URL with new pagination parameters
    parsedUrl.searchParams.set(
      'offset',
      actualPaginationRequest.offset.toString(),
    );
    parsedUrl.searchParams.set(
      'limit',
      actualPaginationRequest.limit.toString(),
    );
    parsedUrl.searchParams.delete('page');
    config.url = parsedUrl.toString().replace(config.baseURL || '', '');
  }

  return config;
});

secureApi.interceptors.response.use(
  response => {
    if (
      response.data &&
      'results' in response.data &&
      'count' in response.data &&
      'next' in response.data &&
      'previous' in response.data
    ) {
      const paginatedData = response.data as ActualPaginationResponse<unknown>;
      response.data = parse2DesiredPagination(paginatedData);
    }
    return response;
  },
  error => handleApiError(error),
);

const refreshAuthLogic = async (failedRequest: unknown) => {
  // Refresh logic here
  const { tokens, setTokens, signOut } = useAuthStore.getState();
  try {
    if (!tokens) {
      throw new Error('No tokens');
    }
    const response = await api.post('/accounts/token/refresh', {
      refresh: tokens.refresh,
    });
    const res = response.data as string;
    setTokens({
      access: res,
      refresh: '',
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    failedRequest.response.config.headers.Authorization = `Bearer ${tokens.access.token}`;
  } catch {
    signOut();
  }
};

createAuthRefreshInterceptor(secureApi, refreshAuthLogic);
