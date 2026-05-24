// // middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   // 1. 브라우저 쿠키에서 'auth-token'이라는 이름의 토큰을 가져옵니다.
//   const token = request.cookies.get('auth-token'); 
  
//   // 2. 로그인 페이지와 회원가입 페이지는 예외 처리
//   const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
//                      request.nextUrl.pathname.startsWith('/signup');

//   // 3. 로그인이 안 되어 있고(토큰 없음) 인증 페이지가 아니라면 로그인 페이지로 리다이렉트
//   if (!token && !isAuthPage) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   // 4. 이미 로그인했는데 로그인 페이지로 가려고 하면 메인으로 보냄 (선택 사항)
//   if (token && isAuthPage) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };

// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // [테스트용] 아래 변수를 true로 바꾸면 로그인이 된 것처럼 간주되어 리다이렉트가 멈춥니다.
  const isTestMode = true; 
  if (isTestMode) return NextResponse.next();

  const token = request.cookies.get('auth-token'); 
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/signup');

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}