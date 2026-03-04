'use server';

import {api} from '@/api';
import {ReviewData} from '@/types';
import {getLocale} from 'next-intl/server';
import {revalidatePath} from 'next/cache';

export async function deleteReviewAction(_: unknown, formData: FormData) {
  const reviewId = formData.get('reviewId')?.toString();
  const bookId = formData.get('bookId')?.toString();
  const lng = await getLocale();

  if (!reviewId) {
    return {
      status: false,
      error: '삭제할 리뷰가 없습니다.',
    };
  }

  try {
    const response = await api.delete<ReviewData>(`/review/${reviewId}`, lng, {next: {tags: [`review-${bookId}`]}});
    revalidatePath(`review-${bookId}`);
    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    return {
      status: false,
      error: `리뷰 삭제에 실패했습니다. ${error}`,
    };
  }
}
