import {ApiResponse} from '@/types';
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

    const responseData = await response.json();

    // 에러 처리
    if (response.status === 501) {
      throw new ApiError(response.status, `error code:${response.status} 서버 응답 없음`);
    }

    if (!response.ok) {
      throw new ApiError(response.status, responseData.message || `${response.status}`);
    }

    // --- [박자 맞추기 핵심 로직 시작] ---

    // 1. 이미 ApiResponse 형태({ data: ... })로 왔다면 그대로 반환
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      return responseData as ApiResponse<TResponse>;
    }

    // 2. 백엔드에서 배열([])이나 순수 객체만 왔다면,
    // 우리가 약속한 ApiResponse 규격으로 포장해서 반환
    return {
      data: responseData as TResponse, // 원본 데이터를 data 필드에 쏙 넣음
      status: response.status,
      message: 'ok',
    };

    // --- [박자 맞추기 핵심 로직 끝] ---
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
