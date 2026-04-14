import { createSupabaseServerClient } from "@/app/_lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedRoute =
    req.nextUrl.pathname.startsWith("/notes") ||
    req.nextUrl.pathname.startsWith("/saved");

  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
