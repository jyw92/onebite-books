// @/components/all-books.tsx
'use client';

import {useInfiniteQuery} from '@tanstack/react-query';
import {api} from '@/api';
import {Book} from '@/types';
import BookItem from './book-item';
import {useEffect} from 'react';
import {useInView} from 'react-intersection-observer';

export default function AllBooks({lng}: {lng: string}) {
  const {ref, inView} = useInView({
    threshold: 0.1, // 약간이라도 보이면 호출
    rootMargin: '200px', // 바닥에 닿기 200px 전에 미리 호출 (부드러운 스크롤)
  });

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, status} = useInfiniteQuery({
    queryKey: ['all-books'],
    queryFn: ({pageParam = 1}) => api.get<Book[]>('/book', lng, {page: String(pageParam), limit: '5'}),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // 1. 데이터가 없으면 즉시 종료
      if (!lastPage.data || lastPage.data.length === 0) return null;

      // 2. 백엔드가 페이징 처리를 안 해서 계속 전체(12개)를 줄 경우 방어 로직
      // 지금까지 받은 데이터 개수와 이번에 받은 개수가 같다면 데이터가 안 변한 것이므로 중단
      const isDuplicate = allPages.some(
        (page) => page.data.length === lastPage.data.length && page.data[0]?.id === lastPage.data[0]?.id,
      );
      if (allPages.length > 0 && isDuplicate && lastPage.data.length > 5) return null;

      // 3. 5개 미만으로 가져왔다면 다음 페이지는 없음
      if (lastPage.data.length < 5) return null;

      return allPages.length + 1;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') return <p>로딩 중...</p>;
  if (status === 'error') return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

  return (
    <div>
      {data?.pages.map((group, i) => (
        <div key={i}>
          {group.data.map((book) => (
            <BookItem key={book.id} {...book} />
          ))}
        </div>
      ))}

      <div ref={ref} style={{padding: '20px', textAlign: 'center'}}>
        {isFetchingNextPage
          ? '더 가져오는 중...'
          : hasNextPage
            ? '스크롤을 내려서 더 보기'
            : '모든 도서를 불러왔습니다.'}
      </div>
    </div>
  );
}
