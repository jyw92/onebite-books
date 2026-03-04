import {getLocale} from 'next-intl/server';
import style from './page.module.css';
import {api} from '@/api';
import {Book, ReviewData} from '@/types';
import ReviewItem from '@/components/review-item';
import ReviewEditor from '@/components/review-editor';

// export const dynamicParams = false
//  {
//   "bookId": 0,
//   "content": "string",
//   "author": "string"
// }

const mockData = {
  id: 1,
  title: '한 입 크기로 잘라 먹는 리액트',
  subTitle: '자바스크립트 기초부터 애플리케이션 배포까지',
  description:
    '자바스크립트 기초부터 애플리케이션 배포까지\n처음 시작하기 딱 좋은 리액트 입문서\n\n이 책은 웹 개발에서 가장 많이 사용하는 프레임워크인 리액트 사용 방법을 소개합니다. 인프런, 유데미에서 5000여 명이 수강한 베스트 강좌를 책으로 엮었습니다. 프런트엔드 개발을 희망하는 사람들을 위해 리액트의 기본을 익히고 다양한 앱을 구현하는 데 부족함이 없도록 만들었습니다. \n\n자바스크립트 기초 지식이 부족해 리액트 공부를 망설이는 분, 프런트엔드 개발을 희망하는 취준생으로 리액트가 처음인 분, 퍼블리셔나 백엔드에서 프런트엔드로 직군 전환을 꾀하거나 업무상 리액트가 필요한 분, 뷰, 스벨트 등 다른 프레임워크를 쓰고 있는데, 실용적인 리액트를 배우고 싶은 분, 신입 개발자이지만 자바스크립트나 리액트 기초가 부족한 분에게 유용할 것입니다.',
  author: '이정환',
  publisher: '프로그래밍인사이트',
  coverImgUrl: 'https://shopping-phinf.pstatic.net/main_3888828/38888282618.20230913071643.jpg',
};

export function generateStaticParams() {
  return [{id: '1'}, {id: '2'}, {id: '3'}];
}

async function BookDetail({bookId}: {bookId: string}) {
  try {
    const lng = await getLocale();
    const response = await api.get<Book>(`/book/${bookId}`, lng);
    const book = response?.data;

    // 데이터가 없는 경우 처리
    if (!book) {
      return <section>해당 도서를 찾을 수 없습니다. (ID: {bookId})</section>;
    }

    const {title, subTitle, description, author, publisher, coverImgUrl} = book;

    return (
      <section>
        <div className={style.cover_img_container} style={{backgroundImage: `url('${coverImgUrl}')`}}>
          <img src={coverImgUrl} />
        </div>
        <div className={style.title}>{title}</div>
        <div className={style.subTitle}>{subTitle}</div>
        <div className={style.author}>
          {author} | {publisher}
        </div>
        <div className={style.description}>{description}</div>
      </section>
    );
  } catch (err) {
    console.error(err);
    return <section>데이터 로딩 중 오류가 발생했습니다.</section>;
  }
}

async function ReviewList({bookId}: {bookId: string}) {
  const lng = await getLocale();
  const response = await api.get<ReviewData[]>(`/review/book/${bookId}`, lng);

  // response.data가 없을 경우 빈 배열로 초기화하거나 예외 처리
  const reviews = response.data || [];

  // 만약 리뷰가 없을 때 다른 메시지를 보여주고 싶다면:
  if (reviews.length === 0) {
    return <section>아직 작성된 리뷰가 없습니다.</section>;
  }

  return (
    <section>
      {reviews.map((review) => (
        <ReviewItem key={`review-item-${review.id}`} {...review} />
      ))}
    </section>
  );
}

export default async function Page({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  return (
    <div className={style.container}>
      <BookDetail bookId={id} />
      <ReviewEditor bookId={id} />
      <ReviewList bookId={id} />
    </div>
  );
}
