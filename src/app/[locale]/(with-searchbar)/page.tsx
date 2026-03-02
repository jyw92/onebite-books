import BookItem from '@/components/book-item';
import style from './page.module.css';
import {api} from '@/api';
import {type Book} from '@/types';
import {getLocale} from 'next-intl/server';

async function Allbooks({data}: {data: Book[]}) {
  // const response = await fetch(`http://localhost:12345/book`);
  // if (!response.ok) {
  //   return <div>오류가 발생했습니다...</div>;
  // }
  // const allBooks: Book[] = await response.json();

  return (
    <div>
      {data.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}
async function RecoBooks({data}: {data: Book[]}) {
  // const response = await fetch(`http://localhost:12345/book/random`);

  // if (!response.ok) {
  //   return <div>오류가 발생했습니다...</div>;
  // }
  // const recoBooks: Book[] = await response.json();

  return (
    <div>
      {data.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

export default async function Home() {
  // // 1. 현재 접속한 언어 가져오기 (ko, en 등)
  // const lng = await getLocale();

  // // 2. api.get 활용
  // // <Book[]>는 TResponse 자리에 들어가며, 결과의 response.data 타입을 결정합니다.
  // const response = await api.get<Book[]>('/book', lng);

  // // 3. 데이터 추출
  // const books = response.data;
  // console.log(books);

  const lng = await getLocale();
  const [allResponse, recoResponse] = await Promise.all([
    // 전체 도서: 3600초(1시간) 동안만 캐시하고 그 이후엔 갱신해라
    api.get<Book[]>('/book', lng, {}, {next: {revalidate: 3600}}),

    // 추천 도서: 캐시 절대 하지 말고 매번 새로 가져와라 (랜덤이니까!)
    api.get<Book[]>('/book/random', lng, {}, {cache: 'no-store'}),
  ]);

  const allBooks = allResponse.data || [];
  const recoBooks = recoResponse.data || [];

  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        <RecoBooks data={recoBooks} />
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        <Allbooks data={allBooks} />
      </section>
    </div>
  );
}
