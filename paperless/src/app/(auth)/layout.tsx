import React from "react";
import Logo from "../_components/ui/Logo";
import { createSupabaseServerClient } from "../_lib/supabase";
import { redirect } from "next/navigation";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Paperless",
    default: "Paperless - The Smart Study App",
  },
  description: "Organize, summarize, and study your markdown notes with AI.",
};

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/notes");
  }

  return (
    <div
      // className="min-h-screen w-full bg-[#7C6F8A] bg-[radial-gradient(circle,#7C6F8A_0%,#3A314A_75%,#3A314A_100%)]"
      className="bg-background min-h-screen w-full"
    >
      <header className="absolute top-0 left-0 z-10 p-8">
        <div className="hidden sm:block">
          <Logo variant="light-mode" size="small" />
        </div>

        <div className="block sm:hidden">
          <Logo variant="light-mode" />
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
