'use client';

import {createPortal} from 'react-dom';
import style from './modal.module.css';
import {useEffect, useRef} from 'react';
import {useRouter} from 'next/navigation';

export default function Modal({children}: {children: React.ReactNode}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
      dialogRef.current?.scrollTo({top: 0});
    }
  }, []);
  return createPortal(
    <dialog
      ref={dialogRef}
      className={style.modal}
      onClose={() => router.back()}
      onClick={(e) => {
        const target = e.target as HTMLElement; // 단언(Assertion) 추가
        if (target.tagName === 'DIALOG') {
          router.back();
        }
      }}
      // onClick={(e) => {
      //   // e.target이 HTMLDialogElement 인스턴스인지 확인
      //   if (e.target instanceof HTMLDialogElement) {
      //     router.back();
      //   }
      // }}
    >
      {children}
    </dialog>,
    document.getElementById('modal-root') as HTMLElement,
  );
}
