import {ApiResponse} from '@/types';
import {notFound} from 'next/navigation';
// import * as Sentry from '@sentry/nextjs';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestConfig<TData = unknown> {
  method?: HttpMethod;
  data?: TData;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = '';
  }
}

// src/api.ts

export async function fetchApi<TResponse, TData = unknown>(
  url: string,
  lng: string,
  config: RequestConfig<TData> = {},
): Promise<ApiResponse<TResponse>> {
  const {method = 'GET', data, params, headers: customHeaders = {}, cache, next} = config;

  const queryParams = params ? `?${new URLSearchParams(params)}` : '';
  const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}${queryParams}`;

  try {
    console.log(`요청 시작: ${method} ${fullUrl}`);
    const response = await fetch(fullUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': lng,
        ...customHeaders,
      },
      ...(data && {body: JSON.stringify(data)}),
      ...(cache && {cache}),
      ...(next && {next}),
    });

    // ✅ 204 No Content 또는 빈 body 처리
    const contentType = response.headers.get('Content-Type') ?? '';
    const hasBody = contentType.includes('application/json') && response.status !== 204;
    const responseData = hasBody ? await response.json() : null;

    if (response.status === 501) {
      throw new ApiError(response.status, `error code:${response.status} 서버 응답 없음`);
    }

    if (!response.ok) {
      throw new ApiError(response.status, responseData?.message || `${response.status}`);
    }

    // ✅ body가 없는 성공 응답 (204 등) 처리
    if (responseData === null) {
      return {
        data: null as TResponse,
        status: response.status,
        message: 'ok',
      };
    }

    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      return responseData as ApiResponse<TResponse>;
    }

    return {
      data: responseData as TResponse,
      status: response.status,
      message: 'ok',
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Fetch Error:', error);
    throw new ApiError(500, 'Internal Server Error');
  }
}

// 편의성을 위한 메서드별 헬퍼 함수들
export const api = {
  get: <TResponse>(
    url: string,
    lng: string,
    params?: Record<string, string>,
    config: Omit<RequestConfig, 'method' | 'params'> = {},
  ) => {
    return fetchApi<TResponse>(url, lng, {...config, method: 'GET', params});
  },

  post: <TResponse, TData>(
    url: string,
    lng: string,
    data: TData,
    config: Omit<RequestConfig<TData>, 'method'> = {},
  ) => {
    return fetchApi<TResponse, TData>(url, lng, {...config, method: 'POST', data});
  },

  put: <TResponse, TData>(url: string, lng: string, data: TData, config: Omit<RequestConfig<TData>, 'method'> = {}) => {
    return fetchApi<TResponse, TData>(url, lng, {...config, method: 'PUT', data});
  },

  delete: <TResponse>(url: string, lng: string, config: Omit<RequestConfig, 'method'> = {}) => {
    return fetchApi<TResponse>(url, lng, {...config, method: 'DELETE'});
  },

  patch: <TResponse, TData>(
    url: string,
    lng: string,
    data?: TData,
    config: Omit<RequestConfig<TData>, 'method'> = {},
  ) => {
    return fetchApi<TResponse, TData>(url, lng, {...config, method: 'PATCH', data});
  },
};
