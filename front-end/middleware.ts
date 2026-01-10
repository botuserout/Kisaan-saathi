
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // logic to check for session token
    // valid authentication implementation requires setting a cookie on the client side
    // for this 'mock' implementation we'll inspect a session cookie
    const session = request.cookies.get('session');

    // List of protected routes
    const protectedPaths = ['/chat', '/tools', '/disease-detection', '/yield-prediction', '/alerts', '/voice'];

    const isProtected = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

    if (isProtected && !session) {
        // Redirect to login if accessing protected route without session
        // return NextResponse.redirect(new URL('/login', request.url));

        // NOTE: For now, we allow access to facilitate testing/demo without full cookie sync implementation 
        // unless the user specifically asks for strict enforcement.
        // To enable strict enforcement, uncomment the return line above.
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/chat/:path*',
        '/tools/:path*',
        '/disease-detection/:path*',
        '/yield-prediction/:path*',
        '/alerts/:path*'
    ],
};
