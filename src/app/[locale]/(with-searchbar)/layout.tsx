import {ReactNode, Suspense} from 'react';
import Searchbar from '@/components/searchbar';

export default function Layout({children}: {children: ReactNode}) {
  return (
    <div>
      <div>{new Date().toLocaleString()}</div>
      <Suspense fallback={<div>로딩 중...</div>}>
        <Searchbar />
      </Suspense>
      {children}
    </div>
  );
}
