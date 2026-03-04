'use client';

import style from './review-editor.module.css';
import {createReviewAction} from '@/actions/create-review.actions';
import {useActionState, useEffect} from 'react';

function ReviewEditor({bookId}: {bookId: string}) {
  const [state, formAction, isPending] = useActionState(createReviewAction, null);

  useEffect(() => {
    if (state && !state.status) {
      alert(state.error);
    }
  }, [state]);

  return (
    <section>
      <form action={formAction} className={style.form_container}>
        <input type="hidden" name="bookId" value={bookId} readOnly />
        <textarea name="content" placeholder="리뷰 내용" required disabled={isPending} />
        <div className={style.submit_container}>
          <input type="text" name="author" placeholder="작성자" required disabled={isPending} />
          <button disabled={isPending}>{isPending ? '작성중...' : '작성하기'}</button>
        </div>
      </form>
    </section>
  );
}

export default ReviewEditor;
