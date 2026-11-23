import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
  if (!isAdminPage) return NextResponse.next();

  // Old password login (backup) — keep for now
  const adminToken = req.cookies.get("admin_token")?.value;
  const tokenValid = process.env.ADMIN_TOKEN && adminToken === process.env.ADMIN_TOKEN;

  // Signed-in admin email
  const email = (req as any).auth?.user?.email;
  const isAdminEmail = process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL;

  if (!tokenValid && !isAdminEmail) {
    return NextResponse.redirect(new URL("/api/auth/signin?callbackUrl=/admin", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: "/admin/:path*",
};
