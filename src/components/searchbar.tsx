'use client';

import {useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import style from './serachbar.module.css';

export default function Searchbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const [search, setSearch] = useState(q || '');

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onSubmit = () => {
    // 1. 이전 검색어와 현재 검색어가 같으면 중복 요청 방지
    if (q === search) return;

    // 2. 검색어가 있으면 쿼리 스트링 포함, 없으면 그냥 /search로 이동
    if (!search) {
      router.push('/search');
    } else {
      router.push(`/search?q=${search}`);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className={style.container}>
      <input value={search} onChange={onChangeSearch} onKeyDown={onKeyDown} />
      <button onClick={onSubmit}>검색</button>
    </div>
  );
}
