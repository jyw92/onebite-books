'use server';

import {api} from '@/api';
import {Review} from '@/types';
import {getLocale} from 'next-intl/server';
import {revalidatePath} from 'next/cache';

export async function createReviewAction(_: unknown, formData: FormData) {
  const lng = await getLocale();
  const bookId = formData.get('bookId')?.toString();
  const content = formData.get('content')?.toString();
  const author = formData.get('author')?.toString();

  if (!bookId || !content || !author) {
    return {
      status: false,
      error: '리뷰 내용과 작성자를 입력해주세요',
    };
  }

  const response = await api.post<Review, Review>(
    `/review`,
    lng,
    {
      bookId,
      content,
      author,
    },
    {next: {tags: [`review-${bookId}`]}},
  );
  // 1. 특정 주소의 해당하는 페이지만 재검증

  revalidatePath(`/book/${bookId}`);

  // 2. 특정 경로의 모든 동적 페이지를 재검증
  // revalidatePath(`/book/[id]`, 'page');

  // 3. 특정 레이아웃을 갖는 모든 페이지 재검증
  // revalidatePath('(with-searchbar)', 'layout');

  // 4. 모든 데이터를 재검증
  // revalidatePath('/', 'layout');

  // 5. 태그 기준, 데이터 캐시 재검증
  revalidatePath(`review-${bookId}`);
  //{next: {tags: [`review-${bookId}`]}}
}
