import { NextRequest, NextResponse } from "next/server";

const SIGN_IN_URL = "/auth/sign-in";
const DASHBOARD_URL = "/dashboard";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;

        // JWT payload uses base64url encoding.
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
        const decoded = atob(padded);
        return JSON.parse(decoded) as Record<string, unknown>;
    } catch {
        return null;
    }
}

function isTokenExpired(token: string): boolean {
    const payload = decodeJwtPayload(token);
    if (!payload) return true;

    const exp = payload.exp;
    if (typeof exp !== "number") return false;

    try {
        return Date.now() >= exp * 1000;
    } catch {
        return true;
    }
}

export async function proxy(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const { pathname } = request.nextUrl;
    const isAuthPage = pathname.startsWith("/auth");

    // Expired access token: force logout and send user to sign-in.
    if (accessToken && isTokenExpired(accessToken)) {
        const response = NextResponse.redirect(new URL(SIGN_IN_URL, request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
    }

    // Expired refresh token: clear auth cookies and send user to sign-in.
    if (refreshToken && isTokenExpired(refreshToken)) {
        const response = NextResponse.redirect(new URL(SIGN_IN_URL, request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
    }

    // Authenticated users should not stay on auth pages.
    if (refreshToken && isAuthPage) {
        return NextResponse.redirect(new URL(DASHBOARD_URL, request.url));
    }

    const isDashboardPage = pathname.startsWith("/dashboard");

    // Unauthenticated users can only access auth routes from protected dashboard pages.
    if (!refreshToken && isDashboardPage) {
        return NextResponse.redirect(new URL(SIGN_IN_URL, request.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        "/auth/:path*",
        "/dashboard/:path*"
    ]
};