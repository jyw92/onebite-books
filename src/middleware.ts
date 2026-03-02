// middleware.ts
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // 1. 경로에 언어 코드가 없는지 확인
  const pathnameHasLocale = ['/ko', '/en'].some((locale) => pathname.startsWith(`${locale}/`) || pathname === locale);

  if (pathnameHasLocale) return;

  // 2. 언어가 없으면 기본 언어(ko)로 리다이렉트
  request.nextUrl.pathname = `/ko${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // matcher에서 정적 파일(이미지 등)은 제외해야 404를 방지할 수 있습니다.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
