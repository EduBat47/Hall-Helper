import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
 
  if (request.nextUrl.pathname.startsWith('/admin/login')) {
      if (session) {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
  }

  return NextResponse.next()
}
 
export const config = {
  matcher: ['/admin/dashboard', '/admin/login'],
}
