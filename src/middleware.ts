import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

type Session = typeof auth.$Infer.Session;

const publicRoutes = ["/", "/login", "/register", "/api/auth"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets, images, and internal Next.js files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if it's a public route
  const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (isPublic) {
    return NextResponse.next();
  }

  // Check session using Better Auth
  try {
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      },
    );

    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware session check failed:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
