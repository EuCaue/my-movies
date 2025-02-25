import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const { pathname } = req.nextUrl;
  if (token && (pathname === "/signin" || pathname === "/signup")) {
    return Response.redirect(new URL("/", req.url));
  }
  if (!token && pathname === "/user")
    return Response.redirect(new URL("/", req.url));
  return null;
}

export const config = {
  matcher: ["/signin", "/signup", "/user"],
};
