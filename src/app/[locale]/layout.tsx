// src/app/[locale]/layout.tsx
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {getLocale, setRequestLocale} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import Link from 'next/link';
import style from './layout.module.css';
import QueryProvider from '@/provider/query-provider';
import {Book} from '@/types';
import {api} from '@/api';

async function Footer() {
  const lng = await getLocale();
  const response = await api.get<Book[]>('/book', lng);
  if (!response.data || response.data.length === 0) {
    // 데이터가 없음
    return <footer>제작 @winterlood</footer>;
  }

  const bookCount = response.data.length;

  return (
    <footer>
      <div>제작 @winterlood</div>
      <div>{bookCount}개의 도서가 등록되어 있습니다.</div>
    </footer>
  );
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  // 지원 안 되는 locale → 404
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <div className={style.container}>
          <header>
            <Link href={'/'}>📚 ONEBITE BOOKS</Link>
          </header>
          <main>
            <QueryProvider>{children}</QueryProvider>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
