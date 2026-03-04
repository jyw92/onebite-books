// import books from '@/mock/books.json';
import BookItem from '@/components/book-item';
import {getLocale} from 'next-intl/server';
import {api} from '@/api';
import {Book} from '@/types';
import {delay} from '@/utils/delay';
import {Suspense} from 'react';
import BookListSkeleton from '@/components/skeleton/book-list-skeleton';

async function SearchResult({q}: {q: string}) {
  const lng = await getLocale();
  // 여기서 await 필수!

  await delay(1500);

  const response = await api.get<Book[]>(
    '/book/search',
    lng,
    {q: q || ''}, // 검색어가 없을 때 빈 문자열 처리
    {cache: 'force-cache'},
  );

  return (
    <div>
      {response.data.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{q?: string}>; // Promise로 정의
}) {
  const {q} = await searchParams;
  return (
    <Suspense fallback={<BookListSkeleton count={3} />}>
      <SearchResult q={q || ''} />
    </Suspense>
  );
}
