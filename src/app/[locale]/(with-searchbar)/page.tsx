import BookItem from '@/components/book-item';
import style from './page.module.css';
import {api} from '@/api';
import {type Book} from '@/types';
import {getLocale} from 'next-intl/server';
import {delay} from '@/utils/delay';
import {Suspense} from 'react';
// import BookItemSkeleton from '@/components/skeleton/book-item-skeleton';
import BookListSkeleton from '@/components/skeleton/book-list-skeleton';

//특정 페이지의 유형을 강제로 Static, Dynamic 페이지로 설정
//1. auto : 기본값, 아무것도 강제하지 않음
//2. force-dynamic : 페이지를 강제로 Dynamic 페이지로 설정
//3. force-static : 페이지를 강제로 Static 페이지로 설정
//4. error : 페이지를 강제로 Static페이지 설정 (설정하면 안되는 이유 빌드오류)
// export const dynamic = 'auto';
export const dynamic = 'force-dynamic';
async function Allbooks({data}: {data: Book[]}) {
  await delay(1500);
  return (
    <div>
      {data.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}
async function RecoBooks({data}: {data: Book[]}) {
  await delay(3000);
  return (
    <div>
      {data.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

export default async function Home() {
  const lng = await getLocale();
  const [allResponse, recoResponse] = await Promise.all([
    api.get<Book[]>('/book', lng, {}, {cache: 'force-cache'}),

    // 추천 도서: 캐시 절대 하지 말고 매번 새로 가져와라 (랜덤이니까!)
    api.get<Book[]>('/book/random', lng, {}, {next: {revalidate: 3}}),
  ]);

  const allBooks = allResponse.data || [];
  const recoBooks = recoResponse.data || [];

  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        <Suspense fallback={<BookListSkeleton count={3} />}>
          <RecoBooks data={recoBooks} />
        </Suspense>
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        <Suspense fallback={<BookListSkeleton count={3} />}>
          <Allbooks data={allBooks} />
        </Suspense>
      </section>
    </div>
  );
}
