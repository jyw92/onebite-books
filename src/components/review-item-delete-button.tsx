'use client';

import {deleteReviewAction} from '@/actions/delete-review.actions';
import {useActionState, useEffect, useRef} from 'react';

export default function ReviewItemDeleteButton({reviewId, bookId}: {reviewId: number; bookId: number}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(deleteReviewAction, null);

  useEffect(() => {
    if (state && !state.status) {
      alert(state.error);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="bookId" value={bookId} />
      <input type="hidden" name="reviewId" value={reviewId} />
      {isPending ? <div>삭제중</div> : <div onClick={() => formRef.current?.requestSubmit()}>삭제하기</div>}
    </form>
  );
}
