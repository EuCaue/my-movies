import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const { pathname } = req.nextUrl;
  if (token && (pathname === "/signin" || pathname === "/signup")) {
    console.log("here")
    return Response.redirect(new URL("/", req.url));
  }
  return null;
}

export const config = {
  matcher: ["/signin", "/signup"],
};
