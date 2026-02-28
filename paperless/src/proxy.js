import { createSupabaseServerClient } from "@/app/_lib/supabase";
import { NextResponse } from "next/server";

export async function proxy(req) {
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
