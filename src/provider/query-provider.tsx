// src/components/providers/query-provider.tsx
'use client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {useState} from 'react';

export default function QueryProvider({children}: {children: React.ReactNode}) {
  // useState를 써야 페이지 전환 시에도 캐시가 유지됩니다.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 데이터가 '상했다'고 판단하는 시간 (기본 0 -> 1분으로 설정 추천)
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발할 때 데이터 들어오는 걸 볼 수 있는 도구입니다. */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
