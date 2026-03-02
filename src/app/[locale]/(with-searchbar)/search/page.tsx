// import books from '@/mock/books.json';
import BookItem from '@/components/book-item';
import {getLocale} from 'next-intl/server';
import {api} from '@/api';
import {Book} from '@/types';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{q?: string}>; // Promise로 정의
}) {
  const lng = await getLocale();
  const {q} = await searchParams; // 여기서 await 필수!

  const response = await api.get<Book[]>(
    '/book/search',
    lng,
    {q: q || ''}, // 검색어가 없을 때 빈 문자열 처리
    {cache: 'no-store'},
  );

  return (
    <div>
      {response.data.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}
