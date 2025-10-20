import { NextResponse } from "next/server"; // 62.7k (gzipped: 20.5k)
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

const protectedRoutes = [
  "/dashboard",
  "/my-account",
  "/change-password",
  "/password-reset",
  "/update-password",
];

export default async function middleware(request: NextRequest) {
  const session = await auth();

  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
